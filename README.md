# Proto Faker

## Description

This library takes a protobuf defintion (`.proto` file) and churns out mock JSON responses for each message type.

## Getting Started

There are two ways of creating mock objects, either through cli by invoking:

```
$ yarn build
$ node dist/index.js <path-to-proto-file>
```

Or by using it as a library:

```
import { mockJson } from 'proto-faker'

const mocks = mockJson('<path-to-proto-file>')
```

Currently, there are some default mock implementations for basic fields (such as an `id`, which generates a random uuid), but you can extend them with your own by supplying a `mocks` object as the second argument to `mockJson`:

The mocks object should contain the keys of the message you wish to mock, and a function to generate some mock value for that key.

If no mock key/value exists for an object, it will attempt to read from the default `mocks` object, and fall back to simple primitive types (`string`, `int32`) which have random values assigned to them.

```
import { mockJson } from 'proto-faker'

const mocks = {
    bsb: () => '123-456'
}

const mocks = mockJson('<path-to-proto-file>', mocks)
console.log(mocks.BankAccount.bsb) // returns '123-456'
```

## Example

Included is an example protobuf definition (see: `awesome.proto`) which demonstrates basic message types, nested message types, repeated fields, and enums.

Run the example and it will output to your console the fully-mocked objects.

```
$ yarn build
$ node dist/index.js ./src/awesome.proto
{
  "BankAccount": {
    "id": "bab86429-cea2-4542-982d-2c9002090fa5",
    "accountNumber": "d75oyd",
    "bsb": "3p2h7a",
    "nestedFoo": [
      {
        "id": "aea65eb5-230d-4b1c-9cce-502159ccfe95",
        "foo": "dt5q1r",
        "bar": "gfv1r"
      },
      {
        "id": "f622523e-f968-4b15-9983-8bb4eb3a1cbf",
        "foo": "ue70ng",
        "bar": "79ijzq"
      },
      {
        "id": "33e4d3ff-920a-4b73-9afb-f27b2161f7d7",
        "foo": "7zji4qs",
        "bar": "do44qh"
      },
      {
        "id": "12cd79e2-118d-4901-b00e-fd2ace5c191b",
        "foo": "m9eq6",
        "bar": "cajpsc"
      },
      {
        "id": "0001d8c8-50a9-4538-9b89-99cab4770765",
        "foo": "uv6g3",
        "bar": "5nv4nw"
      },
      {
        "id": "b53f0607-7368-4534-8f43-07e44adeaf62",
        "foo": "redv69",
        "bar": "nczwkhw"
      },
      {
        "id": "a5af3703-fa1c-4a31-add4-f07f8dd1220b",
        "foo": "80vd37",
        "bar": "l41137"
      },
      {
        "id": "9c0a397e-5fdc-4071-9609-37a5db832bd1",
        "foo": "208sfd",
        "bar": "lfdnw"
      }
    ],
    "baz": 80,
    "status": 2
  },
  "NestedFoo": {
    "id": "a9e54237-372f-4e4f-9106-fd46e5bd45ca",
    "foo": "ymat1",
    "bar": "exqrrj"
  },
  "Status": {
    "Enum": 2
  }
}
```
