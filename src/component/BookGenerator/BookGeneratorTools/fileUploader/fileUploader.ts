import { Book_children, Book_body, book_body_voice } from "../../BookGenerator/BookGenerator";
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

    private static Book_body_array: Book_body[] = [];
    private static Book_body_file_type_array: Book_body[] = [];
    private static Uploaded_id_obj_array: book_body_voice[] = [];
    private static book_json: Book_children[] = [];
    private static uploaded_id : string[] = [];


    static book_children_array_filter_by_body_type(array: Book_children[], body_type: string): Book_body[] | [] {
        let i;
        for ( i = 0; i < array.length; i++) {
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

        // const rtnArray: Book_body[] = BGUtility.Book_body_array;
        // BGUtility.Book_body_array = [];
        // return rtnArray;
        return BGUtility.Book_body_array;
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

    static id_exist_checker(comming_id : string):boolean{
        let is_exist : boolean = false;
        if(BGUtility.uploaded_id.length === 0){
            return is_exist;
        }
        for (let i = 0; i < BGUtility.uploaded_id.length; i++) {
            if(BGUtility.uploaded_id[i] === comming_id){
                is_exist = true;
            }
        }
        return is_exist
    }

    static async upload_file_and_save_id(array: Book_body[]): Promise<book_body_voice[] | []> {
        let rejected = false;
        for (let i = 0; i < array.length; i++) {
            let current_id : string = array[i].front_id;
            if(!BGUtility.id_exist_checker(current_id)){
                let res = await BGUtility.uploadFileReq((array[i] as book_body_voice).voice).catch(e => {
                    rejected = true;
                });
                if (rejected) {
                    break;
                };
                if (res && res.length) {
                    let newBody : book_body_voice = { front_id : current_id , type : 'voice' , name :( array[i] as book_body_voice).name , voice : res[0] }
                    BGUtility.Uploaded_id_obj_array.push(newBody);
                    BGUtility.uploaded_id.push(current_id);
                };
            }
        }
        if (rejected) {
            return [];
        };
        const rtnArray = BGUtility.Uploaded_id_obj_array;
        BGUtility.Uploaded_id_obj_array = [];
        BGUtility.uploaded_id = [];
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
