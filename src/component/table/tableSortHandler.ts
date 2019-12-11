export abstract class TABLE_SORT {

    private static sort: string[] = [];

    static sortArrayReseter(){
        TABLE_SORT.sort = [];
    }

    static sortArrayReturner(): string[]{
        return TABLE_SORT.sort;
    }

    static coming_field_name_by_sortType_and_that_reverseType_exist_in_sortArray(comingType: string, reverseType: string) {

        let comingType_exist: boolean = TABLE_SORT.sort.includes(comingType);
        let reverseType_exist: boolean = TABLE_SORT.sort.includes(reverseType);

        if (comingType_exist === true && reverseType_exist === true) {

            TABLE_SORT.handle_add_or_remove_sort(1, comingType, reverseType);

        } else if (comingType_exist === true && reverseType_exist === false) {

            TABLE_SORT.handle_add_or_remove_sort(2, comingType, reverseType);

        } else if (comingType_exist === false && reverseType_exist === true) {

            TABLE_SORT.handle_add_or_remove_sort(3, comingType, reverseType);

        } else {

            TABLE_SORT.handle_add_or_remove_sort(4, comingType, reverseType);
        }
        return;
    }

    static handle_add_or_remove_sort(num: number, comingType: string, reverseType: string) {

        if (num === 1) {
            let index_for_action: number = TABLE_SORT.sort.indexOf(comingType);
            TABLE_SORT.sort.splice(index_for_action, 1);
        }

        if (num === 2) {
            let index_for_action: number = TABLE_SORT.sort.indexOf(comingType);
            TABLE_SORT.sort.splice(index_for_action, 1);
        }

        if (num === 3) {
            let index_for_action: number = TABLE_SORT.sort.indexOf(reverseType);
            TABLE_SORT.sort.splice(index_for_action, 1, comingType);
        }

        if (num === 4) {
            TABLE_SORT.sort.push(comingType);
        }
        return;
    }
}
