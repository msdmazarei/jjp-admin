import React from 'react';
// import { History } from 'history';
import { BaseComponent } from '../../_base/BaseComponent';
import { TInternationalization } from '../../../config/setup';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../redux/app_state';
// import { IToken } from '../../../model/model.token';
// import { ToastContainer } from 'react-toastify';
// import { Book_children } from '../BookGenerator/BookGenerator';
import SortableTree, { toggleExpandedForAll } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';

interface IState {
    // book_children: Book_children[];
    treeData: any;
    searchString: any;
    searchFocusIndex: any;
    searchFoundCount: any
}

interface IProps {
    // match: any;
    // history: History;
    internationalization: TInternationalization;
    // onChange? : (children : any[]) => void;
}

//

const maxDepth = 5;

const renderDepthTitle = (path: any) => `Depth: ${path.length}`;

const treeData = [
    {
        "title": "اولین فصل کتاب Book1",
        "children1": [
            {
                "type": "text",
                "text": "حسین فریدون لحظاتی قبل از معرفی خود به اوین گفت: «اجرای حکم اینجانب نشان داد که \"برادر رییس جمهور بودن\" نه تنها هیچ مزیتی برای من نبود که می تواند خودش یک اتهام باشد! و من خوشحالم که حتی در این مقام برای انقلاب و نظامی که آن را دوست داشته و تلاش کرده ام قربانی می شوم."
            },
            {
                "type": "text",
                "text": "اولا. در این پرونده یک ریال از بیت المال حیف و میل نشده است و اصولا پای بیت المال درکار نبوده است. در واقع کل پولی که از آن حرف زده می شود پول شخصی یک نفر است که به فرد دیگری قرض داده شده و هیچ یک از آن دو نفر من نبوده ام و من فقط بر این قرض شاهد و ضامن بوده ام و یک ریال آن به جیب بنده یا خانواده بنده واریز نشده است ... که اگر خلافش بود اعلام کنید."
            },
            {
                "type": "text",
                "text": "ثانیا. من برخلاف کیفرخواست و دادنامه و حکم صادره سفارش هیچ کسی را به هیچ مقامی نکرده ام و هیچ مقامی تعیین و جابجا نشده است ... که اگر خلافش بود اعلام کنید."
            },
            {
                "type": "text",
                "text": "ثالثا. تمام پرونده تشکیل شده مستند به شنود غیر قانونی از جمله شنود از دفتر رییس جمهور است که هم غیر قانونی، هم غیر شرعی و هم غیر اخلاقی است و باید از سوی دولت و قوه قضاییه پی گیری شود ... و البته وقتی ضابط و شاکی و قاضی و رسانه هم یکی می شوند بهتر از این نمی شود ..."
            },
            {
                "type": "control",
                "control": "NEW_LINE"
            },
            {
                "type": "text",
                "text": "بر این اساس من آماده ام متن کامل حکم، دادنامه، کیفرخواست و مستندات در فضای عمومی برای اطلاع مردم منتشر شود تا سیه روی شود هر که در او غش باشد. وکیل من آماده پاسخگویی حقوقی به همه پرسشهای خبرنگاران است و به قوه قضاییه هم عرض می\u200Cکنم نگران من نباشد چون از روزی که این پرونده مطرح شده است، رسانه ها از ذکر نام بنده حتی در مرحله اتهام پرهیز نکردند و سخنگوی سابق قوه قضاییه که ظاهرا می\u200Cخواست قانون را رعایت کند و به صورت صوری از ذکر نام حسین فریدون پرهیز داشت از صفت \"برادر رییس جمهور\" برای بنده استفاده می کرد که کنایه ای صریح تر از اصل بود ... . در دادگاه علنی نیز تنها خبرنگاران رسانه های خاصی که با ضابط پرونده همراهی و همکاری داشتند می\u200Cتوانستند در دادگاه حاضر شوند. همین رسانه\u200Cها آن قدر حاشیه سازی کردند که قاضی ناگزیر از محکومیت متهمی بود که آنها پیشاپیش حکم محکومیتش را صادر کرده بودند."
            },
            {
                "type": "control",
                "control": "NEW_LINE"
            },
            {
                "type": "text",
                "text": "حال در این شرایط اگر مبنا بر شفافیت است من پیشنهاد میکنم شفافیت حداکثری پیشه کنند و چیزی از مردم پنهان ندارند تا روشن شود من به ملت و دولت و رییس جمهور و بیت المال هیچ خیانتی نکردم و امروز برای خدماتی که برای کشور کرده ام از حبس در ساواک تا جنگ با تجزیه طلبان و نیز مبارزه برای لغو تحریم ها هیچ شرمنده نیستم و هزینه همه آنها را پرداخت می کنم ... من این حبس را در ادامه زندان برای انقلاب، در تداوم گروگان گیری تجزیه طلبان، در کنار تلاش برای صلح و هزینه پیروزی برای دولت اعتدال می دانم و با همه دشواری این بار را تنها بر دوش می کشم اما مردم را به شهادت و قضاوت نهایی می طلبم که بر اساس جوسازی و کلی بافی قضاوت نکنند که قاضی نهایی خداوند حکیم و علیم و آنگاه مردم هستند."
            }
        ],
        "children-": [
            {
                "title": "Sub1",
                "body": [
                    {
                        "type": "control",
                        "control": "NEW_LINE"
                    },
                    {
                        "type": "text",
                        "text": "زیر فصل اول "
                    }
                ],
                "children": [
                    {
                        "title": "Sub11",
                        "body": [
                            {
                                "type": "control",
                                "control": "NEW_LINE"
                            },
                            {
                                "type": "text",
                                "text": "زیر زیر فصل اول "
                            }
                        ],
                        "children": [
                            {}
                        ]
                    },
                    {
                        "title": "Sub12",
                        "body": [
                            {
                                "type": "control",
                                "control": "NEW_LINE"
                            },
                            {
                                "type": "text",
                                "text": "زیر دوم زیر فصل اول "
                            }
                        ],
                        "children": [

                        ]
                    }
                ]
            }
        ]
    },
    {
        "title": "Second.Chapter",
        "body": [
            {
                "type": "control",
                "control": "NEW_LINE"
            },
            {
                "type": "text",
                "text": "فصل دوم"
            }
        ],
        "children": [
            {
                "title": "SUB21",
                "body": [
                    {
                        "type": "text",
                        "text": "سلام من دارم میام"
                    }
                ],
                "children": [
                    {
                        "title": "SUB2.11",
                        "body": [
                            {
                                "type": "text",
                                "text": "helo"
                            }
                        ]
                    },
                    {
                        "title": "SUB212",
                        "body": [
                            {
                                "type": "text",
                                "text": "helo"
                            }
                        ]
                    }

                ]
            },
            {
                "title": "SUB22",
                "body": []
            }
        ]
    }
];
class AudioBookGeneratorComponent extends BaseComponent<IProps, IState> {
    state = {
        searchString: '',
        searchFocusIndex: 0,
        searchFoundCount: null,
        treeData,
    };

    handleTreeOnChange(treeData: any) {
        this.setState({
            ...this.state,
            treeData: treeData,
        });
    };

    handleSearchOnChange(e: any) {
        this.setState({
            searchString: e.target.value,
        });
    };

    selectPrevMatch() {
        const { searchFocusIndex, searchFoundCount } = this.state;

        this.setState({
            searchFocusIndex:
                searchFocusIndex !== null
                    ? (searchFoundCount! + searchFocusIndex - 1) % searchFoundCount!
                    : searchFoundCount! - 1,
        });
    };

    selectNextMatch = () => {
        const { searchFocusIndex, searchFoundCount } = this.state;

        this.setState({
            searchFocusIndex:
                searchFocusIndex !== null
                    ? (searchFocusIndex + 1) % searchFoundCount!
                    : 0,
        });
    };

    toggleNodeExpansion(expanded: any) {
        this.setState(prevState => ({
            treeData: toggleExpandedForAll({
                treeData: prevState.treeData,
                expanded,
            }),
        }));
    };



    render() {
        const {
            treeData,
            searchString,
            searchFocusIndex,
            searchFoundCount,
        } = this.state;
        return (
            <div className="wrapper">
                <div className="bar-wrapper">
                    <button onClick={this.toggleNodeExpansion.bind(this, true)}>
                        Expand all
          </button>
                    <button onClick={this.toggleNodeExpansion.bind(this, false)}>
                        Collapse all
          </button>
                    <label>Search: </label>
                    <input onChange={this.handleSearchOnChange} />
                    <button className="previous" onClick={this.selectPrevMatch}>
                        Previous
          </button>
                    <button className="next" onClick={this.selectNextMatch}>
                        Next
          </button>
                    <label>
                        {searchFocusIndex} / {searchFoundCount}
                    </label>
                </div>
                <div className="tree-wrapper">
                    <SortableTree
                        treeData={treeData}
                        onChange={(treeData: any) => this.handleTreeOnChange(treeData)}
                        onMoveNode={(node: any, treeIndex: any, path: any) =>
                            global.console.debug(
                                'node:',
                                node,
                                'treeIndex:',
                                treeIndex,
                                'path:',
                                path
                            )
                        }
                        maxDepth={maxDepth}
                        searchQuery={searchString}
                        searchFocusOffset={searchFocusIndex}
                        canDrag={(node: any) => !node.noDragging}
                        canDrop={(nextParent: any) => !nextParent || !nextParent.noChildren}
                        searchFinishCallback={(matches: any) =>
                            this.setState({
                                searchFoundCount: matches.length,
                                searchFocusIndex:
                                    matches.length > 0 ? searchFocusIndex % matches.length : 0,
                            })
                        }
                        isVirtualized={true}
                    />
                </div>
            </div>
        )
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
    };
};

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        // token: state.token,
    };
};

export const AudioBookGenerator = connect(
    state2props,
    dispatch2props
)(AudioBookGeneratorComponent);