type Page = {
    content: string
}

type Schema = {
    pages: Page[]
    fields: {
        [uid: string]: FieldType
    }
}

export type BaseField = {
    uid: string
    title: string
    description?: string | null
    optinal?: boolean
}

export type GeoField = BaseField & {
    type: 'geo'
    value: {
        latitude: number
        longitude: number
    }
}

export type DateField = BaseField & {
    type: 'date'
    value: number
}

export type SignatureField = BaseField & {
    type: 'signature'
    value: string
}

export type UserField = BaseField & {
    type: 'user'
    value: string
}

export type IntField = BaseField & {
    type: 'int'
    min?: number | null
    max?: number | null
    value: number
}

export type StrField = BaseField & {
    type: 'str'
    min?: number | null
    max?: number | null
    value: string
}

export type TextField = BaseField & {
    type: 'text'
    min?: number | null
    max?: number | null
    value: string
}

export type LinkField = BaseField & {
    type: 'link'
    url: string
}

export type RecordField = BaseField & {
    type: 'record'
    plural: boolean
    value: string[]
}

export type UIDD = {
    uid: string
    display: string
}

export type QuestionField = BaseField & {
    type: 'question'
    answers: UIDD[]
    questions: UIDD[]
    value: {
        [key: string]: string
    }
}

export type OptionFeild = BaseField & {
    type: 'option'
    singleton: boolean
    options: UIDD[]
    value: string[]
}

export type FieldType =
    | IntField
    | StrField
    | UserField
    | GeoField
    | DateField
    | SignatureField
    | LinkField
    | OptionFeild
    | QuestionField
    | TextField
    | RecordField

type X = {
    [T in FieldType as T['type']]: T
}
const default_fields: X = {
    link: {
        type: 'link',
        uid: '',
        title: 'Lonk',
        url: 'https://example.com',
    },
    option: {
        type: 'option',
        uid: '',
        title: 'Option',
        options: [],
        optinal: false,
        singleton: false,
        description: '',
        value: [],
    },
    int: {
        type: 'int',
        uid: '',
        title: 'Number',
        description: '',
        optinal: false,
        max: null,
        min: null,
        value: 0,
    },
    str: {
        type: 'str',
        uid: '',
        title: 'String',
        description: '',
        optinal: false,
        max: null,
        min: null,
        value: '',
    },
    text: {
        type: 'text',
        uid: '',
        title: 'Text',
        description: '',
        optinal: false,
        max: null,
        min: null,
        value: '',
    },
    geo: {
        type: 'geo',
        uid: '',
        title: 'Geo',
        description: '',
        optinal: false,
        value: {
            latitude: 0,
            longitude: 0,
        },
    },
    user: {
        type: 'user',
        uid: '',
        value: '',
        title: 'User',
        description: '',
        optinal: false,
    },
    record: {
        type: 'record',
        uid: '',
        title: 'Record / File',
        description: '',
        optinal: false,
        plural: false,
        value: [],
    },
    date: {
        type: 'date',
        uid: '',
        title: 'Date',
        description: '',
        optinal: false,
        value: 0,
    },
    question: {
        type: 'question',
        uid: '',
        title: 'Questions',
        description: '',
        optinal: false,
        questions: [],
        answers: [],
        value: {},
    },
    signature: {
        type: 'signature',
        uid: '',
        title: 'Signature',
        description: '',
        optinal: false,
        value: '',
    },
}

const field_types = Object.keys(default_fields) as Array<
    keyof typeof default_fields
>

export type FieldMinMax = StrField | IntField | TextField
function have_minmax(f: FieldType): f is FieldMinMax {
    return ['str', 'int', 'text'].includes(f.type)
}

export { Schema, Page, field_types, default_fields, have_minmax }