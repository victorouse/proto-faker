import faker from 'faker';
import R from 'ramda';

export const TIMESTAMP = 'google.protobuf.Timestamp';

const defaultMocks = {
  id: () => faker.random.uuid(),
  [TIMESTAMP]: () => ({
    seconds: faker.date.recent().getTime() / 1000,
  }),
};

const primitiveMocks = {
  string: () => faker.random.words(2),
  int32: () => faker.random.number(100),
  bool: () => faker.random.boolean(),
};

const mockN = (
  k: any,
  v: any,
  mocks: any,
  protos: any,
  repeated: boolean = false,
) => {
  if (repeated) {
    if (Array.isArray(mocks[k])) {
      return mocks[k].map(m => mockType(k, v, m, protos));
    }

    return new Array(faker.random.number(10))
      .fill(null)
      .map(() => mockType(k, v, mocks, protos));
  }

  return mockType(k, v, mocks, protos);
};

const mockType = (k: any, v: any, mocks: any, protos: any) => {
  if (k in mocks) {
    return typeof mocks[k] === 'function' ? mocks[k]() : mocks[k];
  }

  if (v.type in mocks) {
    return typeof mocks[typeof v.type] === 'function'
      ? mocks[v.type]()
      : mocks[v.type];
  }

  if (v.type in protos) {
    return traverseProto(protos[v.type].fields, protos, mocks);
  }

  if (v.type.includes('Enum')) {
    const key = v.type.split('.').shift();
    const {
      [key]: { Enum },
    } = traverseProto({ [key]: protos[key] }, protos, mocks);
    return Enum;
  }

  return v.type;
};

const mockEnum = (e: any) => {
  const length = Object.keys(e).length;
  const values = Object.values(e);

  return values[Math.floor(Math.random() * length)];
};

const traverseProto = (proto: any, protos: any, mocks: {}) =>
  R.mapObjIndexed((v: any, k: any, o: any) => {
    if (typeof v === 'object') {
      if ('nested' in v) {
        return traverseProto(v.nested, protos, mocks);
      }

      if ('fields' in v && Object.keys(v).length > 0) {
        return traverseProto(v.fields, protos, mocks);
      }

      if ('values' in v && k === 'Enum') {
        return mockEnum(v.values);
      }

      if ('type' in v) {
        return mockN(k, v, mocks, protos, v.rule === 'repeated');
      }
    }
  }, proto);

const traverse = (proto: {}, mocks: {} = {}) =>
  traverseProto(proto, proto, mocks);

export const mock = (protos: any) => (message: any, mocks?: any) => {
  const key = typeof message === 'string' ? message : message.name;

  const { [key]: MockedMessage } = traverse(protos, {
    ...primitiveMocks,
    ...defaultMocks,
    ...mocks,
  });

  return MockedMessage;
};
