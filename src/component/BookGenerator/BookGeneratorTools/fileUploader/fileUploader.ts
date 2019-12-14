import { Book_children, Book_body, book_body_voice, book_body_pdf, book_body_epub } from "../../BookGenerator/BookGenerator";
import { UploadService } from "../../../../service/service.upload";


export abstract class BGUtility {

    // start search node in tree

    static searchTree(tree: Book_children[], current_id: string): Book_body | null {
        let i;
        let temp;
        for (i = 0; i < tree.length; i++) {
            if (tree[i].body.length) {
                for (let j = 0; j < tree[i].body.length; j++) {
                    if (tree[i].body[j].front_id === current_id) {
                        return tree[i].body[j];
                    }
                }
            }
            if (tree[i].children.length > 0) {
                temp = this.searchTree(tree[i].children, current_id);
                if (temp) {
                    return temp;
                }
            }
        }
        return null;
    }

    // end search node in tree

    // start file upload function

    private static _uploadService = new UploadService();

    static async uploadFileReq(value: any[]): Promise<string[]> {
        let fileImg = value;
        if (fileImg && (fileImg || []).length) {
            return new Promise(async (res, rej) => {
                let urls = await BGUtility._uploadService.upload(fileImg).catch(e => {
                    rej(e);
                });
                if (urls) {
                    res([...urls.data.result]);
                }
            });
        } else {
            return new Promise((res, rej) => {
                res([]);
            });
        }
    }

    // end file upload function

    private static Stop: boolean = false;
    private static Book_body_array: Book_body[] = [];
    private static Book_body_file_type_array: Book_body[] = [];
    private static Uploaded_id_obj_array: book_body_voice[] = [];
    private static uploaded_id: string[] = [];
    private static PdfUploaded_id_obj_array: book_body_pdf[] = [];
    private static Pdfuploaded_id: string[] = [];
    private static EpubUploaded_id_obj_array: book_body_epub[] = [];
    private static Epubuploaded_id: string[] = [];
    private static book_json: Book_children[] = [];


    static stop_Upload() {
        BGUtility.Stop = true;
    }

    static number_of_file_uploaded() {
        if (!BGUtility.uploaded_id.length) {
            return 0;
        }
        return BGUtility.uploaded_id.length;
    }

    static number_of_pdf_file_uploaded() {
        if (!BGUtility.Pdfuploaded_id.length) {
            return 0;
        }
        return BGUtility.Pdfuploaded_id.length;
    }

    static number_of_epub_file_uploaded() {
        if (!BGUtility.Epubuploaded_id.length) {
            return 0;
        }
        return BGUtility.Epubuploaded_id.length;
    }

    static book_children_array_filter_by_body_type(array: Book_children[], body_type: string): Book_body[] | [] {
        let i;
        for (i = 0; i < array.length; i++) {
            if (array[i].body.length) {
                for (let j = 0; j < array[i].body.length; j++) {
                    if (array[i].body[j].type === body_type) {
                        BGUtility.Book_body_array.push(array[i].body[j]);
                    }
                }
            }
            if (array[i].children.length) {
                this.book_children_array_filter_by_body_type(array[i].children, body_type);
            }
        }

        const rtnArray: Book_body[] = BGUtility.Book_body_array;
        return rtnArray;
        // return BGUtility.Book_body_array;
    }

    static book_body_array_filter_by_file_type(array: Book_body[]): Book_body[] | [] {

        for (let i = 0; i < array.length; i++) {
            if (typeof (array[i] as book_body_voice).voice !== 'string') {
                BGUtility.Book_body_file_type_array.push(array[i]);
            }
        }

        const rtnArray = BGUtility.Book_body_file_type_array;
        BGUtility.Book_body_file_type_array = [];
        BGUtility.Book_body_array = [];
        return rtnArray;
    }

    static id_exist_checker(comming_id: string): boolean {
        let is_exist: boolean = false;
        if (BGUtility.uploaded_id.length === 0) {
            return is_exist;
        }
        for (let i = 0; i < BGUtility.uploaded_id.length; i++) {
            if (BGUtility.uploaded_id[i] === comming_id) {
                is_exist = true;
            }
        }
        return is_exist
    }

    static async upload_file_and_save_id(array: Book_body[]): Promise<book_body_voice[] | []> {
        let rejected: boolean = false;
        let stop: boolean = false;
        for (let i = 0; i < array.length; i++) {
            let current_id: string = array[i].front_id;
            // if(!BGUtility.id_exist_checker(current_id)){   to do add condition for don't upload file if uploaded before
            if (true) {
                if (BGUtility.Stop) {
                    BGUtility.Stop = false;
                    stop = true;
                    BGUtility.Uploaded_id_obj_array = [];
                    BGUtility.uploaded_id = [];
                };
                if (stop) {
                    break;
                };
                let res = await BGUtility.uploadFileReq((array[i] as book_body_voice).voice).catch(e => {
                    BGUtility.Uploaded_id_obj_array = [];
                    BGUtility.uploaded_id = [];
                    rejected = true;
                });
                if (BGUtility.Stop) {
                    BGUtility.Stop = false;
                    stop = true;
                    BGUtility.Uploaded_id_obj_array = [];
                    BGUtility.uploaded_id = [];
                };
                if (rejected || stop) {
                    break;
                };
                if (res && res.length) {
                    let newBody: book_body_voice = { front_id: current_id, type: 'voice', name: (array[i] as book_body_voice).name, voice: res[0] }
                    BGUtility.Uploaded_id_obj_array.push(newBody);
                    BGUtility.uploaded_id.push(current_id);
                };
            }
        }
        if (rejected) {
            return [{ front_id: 'rejected', type: 'voice', name: 'rejected', voice: 'rejected' }];
        };
        if (stop) {
            return [{ front_id: 'stop', type: 'voice', name: 'stop', voice: 'stop' }];
        };
        const rtnArray = BGUtility.Uploaded_id_obj_array;
        BGUtility.Uploaded_id_obj_array = [];
        BGUtility.uploaded_id = [];
        return rtnArray;
    }

    static async upload_pdf_file_and_save_id(array: Book_body[]): Promise<book_body_pdf[] | []> {
        let rejected: boolean = false;
        let stop: boolean = false;
        for (let i = 0; i < array.length; i++) {
            let current_id: string = array[i].front_id;
            // if(!BGUtility.id_exist_checker(current_id)){   to do add condition for don't upload file if uploaded before
            if (true) {
                if (BGUtility.Stop) {
                    BGUtility.Stop = false;
                    stop = true;
                    BGUtility.PdfUploaded_id_obj_array = [];
                    BGUtility.Pdfuploaded_id = [];
                };
                if (stop) {
                    break;
                };
                let res = await BGUtility.uploadFileReq((array[i] as book_body_pdf).pdf).catch(e => {
                    BGUtility.PdfUploaded_id_obj_array = [];
                    BGUtility.Pdfuploaded_id = [];
                    rejected = true;
                });
                if (BGUtility.Stop) {
                    BGUtility.Stop = false;
                    stop = true;
                    BGUtility.PdfUploaded_id_obj_array = [];
                    BGUtility.Pdfuploaded_id = [];
                };
                if (rejected || stop) {
                    break;
                };
                if (res && res.length) {
                    let newBody: book_body_pdf = { front_id: current_id, type: 'pdf', name: (array[i] as book_body_pdf).name, pdf: res[0] }
                    BGUtility.PdfUploaded_id_obj_array.push(newBody);
                    BGUtility.Pdfuploaded_id.push(current_id);
                };
            }
        }
        if (rejected) {
            return [{ front_id: 'rejected', type: 'pdf', name: 'rejected', pdf: 'rejected' }];
        };
        if (stop) {
            return [{ front_id: 'stop', type: 'pdf', name: 'stop', pdf: 'stop' }];
        };
        const rtnArray = BGUtility.PdfUploaded_id_obj_array;
        BGUtility.PdfUploaded_id_obj_array = [];
        BGUtility.Pdfuploaded_id = [];
        return rtnArray;
    }

    static async upload_epub_file_and_save_id(array: Book_body[]): Promise<book_body_epub[] | []> {
        let rejected: boolean = false;
        let stop: boolean = false;
        for (let i = 0; i < array.length; i++) {
            let current_id: string = array[i].front_id;
            // if(!BGUtility.id_exist_checker(current_id)){   to do add condition for don't upload file if uploaded before
            if (true) {
                if (BGUtility.Stop) {
                    BGUtility.Stop = false;
                    stop = true;
                    BGUtility.EpubUploaded_id_obj_array = [];
                    BGUtility.Epubuploaded_id = [];
                };
                if (stop) {
                    break;
                };
                let res = await BGUtility.uploadFileReq((array[i] as book_body_epub).epub).catch(e => {
                    BGUtility.EpubUploaded_id_obj_array = [];
                    BGUtility.Epubuploaded_id = [];
                    rejected = true;
                });
                if (BGUtility.Stop) {
                    BGUtility.Stop = false;
                    stop = true;
                    BGUtility.EpubUploaded_id_obj_array = [];
                    BGUtility.Epubuploaded_id = [];
                };
                if (rejected || stop) {
                    break;
                };
                if (res && res.length) {
                    let newBody: book_body_epub = { front_id: current_id, type: 'epub', name: (array[i] as book_body_epub).name, epub: res[0] }
                    BGUtility.EpubUploaded_id_obj_array.push(newBody);
                    BGUtility.Epubuploaded_id.push(current_id);
                };
            }
        }
        if (rejected) {
            return [{ front_id: 'rejected', type: 'epub', name: 'rejected', epub: 'rejected' }];
        };
        if (stop) {
            return [{ front_id: 'stop', type: 'epub', name: 'stop', epub: 'stop' }];
        };
        const rtnArray = BGUtility.EpubUploaded_id_obj_array;
        BGUtility.EpubUploaded_id_obj_array = [];
        BGUtility.Epubuploaded_id = [];
        return rtnArray;
    }

    static replace_id_instead_of_file(array: Book_children[], bodyIdObjUploaded: book_body_voice[]): Book_children[] {
        if (!array.length || !bodyIdObjUploaded.length) return array;
        BGUtility.book_json = array;

        for (let i = 0; i < bodyIdObjUploaded.length; i++) {
            let id = bodyIdObjUploaded[i].front_id;
            let body = this.searchTree(BGUtility.book_json, id);
            (body! as book_body_voice).voice = bodyIdObjUploaded[i].voice;
        }

        const rtnArray = BGUtility.book_json;
        BGUtility.book_json = [];
        return rtnArray;
    }
}
