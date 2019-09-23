// import React from 'react';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
interface IBaseProps {
    internationalization: TInternationalization;
}

export abstract class ReportBase<p extends IBaseProps, s> extends BaseComponent<p, s>{

}