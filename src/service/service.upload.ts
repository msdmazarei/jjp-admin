import { IAPI_ResponseList, BaseService } from "./service.base";

export class UploadService extends BaseService {
    // protected instance = Axios.create({
    //     baseURL: '/api',
    //     headers: { 'authorization': 'Bearer 605f9393-c448-456c-bd2c-7c74641ba7fb' }
    // });

    upload(files: any[]): Promise<IAPI_ResponseList<string>> {

        // let form_data_instance = 
        this.axiosTokenInstance.defaults.headers['Content-Type'] = 'multipart/form-data';
        // const a_instance = Axios.create({
        //     baseURL: '/api',
        //     headers: {
        //         'authorization': 'Bearer 0be2e4cb-88b3-44a6-aeff-4eeb96e411c6',
        //         'Content-Type': 'multipart/form-data'
        //     }
        // });

        let bodyFormData = new FormData();
        // bodyFormData.set('files', files);
        files.forEach(f => {
            bodyFormData.append('files', f);
        })

        return this.axiosTokenInstance.post('/upload', bodyFormData);
    }
}