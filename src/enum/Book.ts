export enum BOOK_ROLES {
    Author = 'Author',
    Writer = 'Writer',
    Translator = 'Translator',
    Press = 'Press',
    Contributer = 'Contributer',
    Designer = 'Designer',
    Narrator = 'Narrator'
}

export enum BOOK_TYPES {
    DVD = 'DVD',
    Audio = 'Audio',
    Hard_Copy = 'Hard_Copy',
    Pdf = 'Pdf',
    Epub = 'Epub',
    Msd = 'Msd',
}

export enum BOOK_GENRE {
    Comedy = 'Comedy',
    Drama = 'Drama',
    Romance = 'Romance',
    Social = 'Social',
    Religious = 'Religious',
    Historical = 'Historical',
    Classic = 'Classic',
    Science = 'Science',
}

export enum BOOK_CONTRNT_TYPE {
    Original = 'Original',
    Brief = 'Brief',
}

export enum BOOK_CONTENT_STATUS {
    content_generated = 'content_generated',
    content_not_generated = 'content_not_generated',
}

export enum BOOK_CONTENT_GENERATE_REQUEST_RESULT {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    PENDING = 'PENDING',
}
