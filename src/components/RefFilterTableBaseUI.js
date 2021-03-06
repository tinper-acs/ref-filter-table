
import React, { Component } from 'react';
import shallowequal from 'shallowequal';
import RefCoreError from 'ref-core/lib/refs/RefCoreError';
import RefCoreButton from 'ref-core/lib/refs/RefCoreButton';
import RefCoreTab from 'ref-core/lib/refs/RefCoreTab';
import RefCoreSearch from 'ref-core/lib/refs/RefCoreSearch';
import { paginationLocale } from 'ref-core/lib/utils/locale.js'
import Checkbox from 'bee-checkbox';
import Modal from 'bee-modal';
import Pagination from 'bee-pagination';
import Table from 'bee-table';
import multiSelect from "bee-table/build/lib/multiSelect.js";
import Loading from 'bee-loading';
import { refValParse } from '../utils'
class RefFilterTableBaseUI extends Component {
    columnsData = []//表头数据
    tableData = []//表格数据
    pageCount = 1//总页数
    pageSize = '10'//每页数据数
    currPageIndex = 1//激活页码
    fliterFormInputs = []
    filterInfo = {};
    constructor(props) {
        super(props);
        this.state = {
            selectedDataLength: 0,//checkedArray的长度
            tableIsSelecting: true,//tab切换
        }
        this.checkedArray = [];
        this.checkedMap = {};
        this.TableView = props.multiple ? multiSelect(Table, Checkbox) : Table;
    }
    shouldComponentUpdate(nextProps, nextState) {
        // let result  = !shallowequal(nextState, this.state);
        //使用state是因为mustRender不同必须重新渲染，this中的三种data不一致也必须更新
        let dataEqual = nextProps.tableData === this.props.tableData && nextProps.columnsData === this.props.columnsData && nextProps.fliterFormInputs === this.props.fliterFormInputs
        return !shallowequal(nextState, this.state) || !dataEqual || nextProps.showModal !== this.props.showModal;
    }
    componentWillReceiveProps(nextProps) {
        let { strictMode, valueField = "refpk", matchData = [], value } = nextProps;
        //严格模式下每次打开必须重置数据
        if (nextProps.showModal && !this.props.showModal) { //正在打开弹窗
            if (strictMode || !this.columnsData.length || this.currPageIndex !== 1) {
                //开启严格模式 或 表头信息没有获取到，即初始化失败是必须重置
                this.initComponent();
            }
            // 	//内部缓存已选择值，不通过 state 缓存，表格缓存状态自动实现
            // 	this.checkedArray = Object.assign(this.checkedArray,  nextProps.checkedArray || []);
            // 	//内部缓存已选择值，缓存成 Map 便于检索
            // 	this.checkedMap = {};
            // 	this.checkedArray.forEach(item=>{
            //     this.checkedMap[item[valueField]] = item;
            //   });
            //   this.setState({selectedDataLength:this.checkedArray.length,tableIsSelecting: true})
            // }
            //这里改用matchData，由于第一次运行到这里选中可能从value中取值
            this.checkedArray = Object.assign([], nextProps.matchData || []);
            this.checkedMap = {};
            this.checkedArray.forEach(item => {
                this.checkedMap[item[valueField]] = item;
            });
            //内部缓存已选择值，缓存成 Map 便于检索
            this.setState({ selectedDataLength: this.checkedArray.length, tableIsSelecting: true })

        }

    }
    initComponent = () => {
        let { value, matchData = [], valueField = "refpk" } = this.props;
        let valueMap = refValParse(value);
        if (this.checkedArray.length == 0 && valueMap[valueField]) {
            if (matchData.length > 0) {
                this.checkedMap = {};
                this.checkedArray = matchData.map(item => {
                    item.key = item[valueField];
                    item._checked = true;
                    this.checkedMap[item.key] = item;
                    return item;
                });
                this.setState({
                    selectedDataLength: this.checkedArray.length,
                    mustRender: Math.random()
                })
            }
        };
    }
    /**start:按钮操作 */
    handleBtnSave = () => {
        this.props.onSave(Object.assign([], this.checkedArray));
    }

    handleBtnCancel = () => {
        this.props.onCancel()
    }
    onClickBtn = (type) => {
        switch (type) {
            case 'save':
                this.handleBtnSave();
                break;
            case 'cancel':
                this.handleBtnCancel()
                break;
            case 'clear':
                this.checkedArray = [];
                this.checkedMap = {};
                this.setState({
                    selectedDataLength: 0,
                    mustRender: Math.random()
                });
                break;
        }
    };
    /**end:按钮操作 */
    onSelectTabItem = (a, state) => {
        if (state === 'selecting') {
            // this.pageCount = Math.ceil(this.totalElements / this.pageSize);
            this.setState({
                tableIsSelecting: true,//展示已选择列表
            });
        } else {
            // this.pageCount = 1;
            this.setState({
                tableIsSelecting: false,//不展示已选择列表
            });
        }
    }
    /** start:表格操作 */
    /**
       * 为数据增加 key
       * @record {object} 该行数据
       */
    putRowKey = (record, i) => {
        return record.key
    };
    /**
       * 为选中行增加背景色，只在单选状态生效
       * @record {object} 该行数据
       */
    renderRowClassName = (recode) => {
        if (this.props.multiple) return;
        return recode._checked ? 'ref-multiple-table-row-selected' : '';
    }
    /**
       * 多选状态下表格只能通过选择 checkbox 来选值，同时触发改方法
       * @function
       * @param checkedArray  已勾选值，表格中自动去除未勾选值
       * @param recode  当前操作的行数据
       */
    getSelectedDataFunc = (checkedArray, recode) => {
        if (!this.props.multiple) return;
        const _this = this;
        let { valueField = "refpk" } = this.props;
        if (recode) {
            //单条操作
            if (recode._checked && !_this.checkedMap[recode[valueField]]) {

                _this.checkedArray.push(recode);
                _this.checkedMap[recode[valueField]] = recode;

            } else if (!recode._checked && this.checkedMap[recode[valueField]]) {

                delete _this.checkedMap[recode[valueField]];
                _this.checkedArray = [];
                Object.keys(_this.checkedMap).forEach(item => {
                    _this.checkedArray.push(this.checkedMap[item])
                });

            }
        } else {
            //多条操作
            _this.checkedArray = [];
            let { tableIsSelecting } = this.state;
            if (tableIsSelecting) {
                //选择中...
                if (checkedArray.length > 0) {
                    //全选操作 
                    //去重操作
                    //直接操作当前页数据
                    _this.props.tableData.forEach(item => {
                        if (!_this.checkedMap.hasOwnProperty(item[valueField])) {
                            _this.checkedMap[item[valueField]] = item;
                        }
                    })
                } else {
                    //全取消操作
                    //去重操作
                    //直接操作当前页数据
                    _this.props.tableData.forEach(item => {
                        if (_this.checkedMap.hasOwnProperty(item[valueField])) {
                            delete _this.checkedMap[item[valueField]];
                        }
                    })
                }
                //组装已选数据
                _this.checkedArray = Object.keys(_this.checkedMap).map(item => {
                    return _this.checkedMap[item];
                });
            } else {
                //查看已选择
                if (checkedArray.length <= 0) {
                    //查看时只有取消选择操作，全选操作不会出现这里可考虑取消这个判断
                    _this.checkedMap = {};
                    _this.checkedArray = [];
                }

            }
        }
        _this.setState({
            selectedDataLength: checkedArray.length,
            mustRender: Math.random()
        });
    }
	/**
	 * 双击行选择该行数据，只在单选状态生效
	 * @record {object} 该行数据
	 */
    onRowDoubleClick = (record) => {
        if (this.props.multiple) return;
        let { valueField = "refpk" } = this.props;
        record._checked = true;
        this.checkedArray = [record];
        this.checkedMap = {};
        this.checkedMap[record[valueField]] = record;
        this.handleBtnSave();
    }
	/**
	 * 单击行选择该行数据，只在单选状态生效
	 * @record {object} 该行数据
	 */
    onRowClick = (record) => {
        if (this.props.multiple) return;
        const _this = this;
        let { valueField = "refpk" } = _this.props;

        //点击同一行数据时取消选择
        if (_this.checkedMap.hasOwnProperty(record[valueField])) {
            _this.checkedArray = [];
            _this.checkedMap = {};
            _this.setState({
                mustRender: Math.random()
            });
        } else {
            let checkedRecord = Object.assign({ _checked: true }, record)
            _this.checkedArray = [checkedRecord];
            _this.checkedMap = {};
            _this.checkedMap[checkedRecord[valueField]] = checkedRecord;
            _this.setState({
                mustRender: Math.random()
            });
        }
    }

    /** end:表格操作*/
    render() {
        const _this = this;
        let { className,title = '', backdrop, size = 'lg',
            showModal, lang = 'zh_CN', valueField, emptyBut = false, buttons, filterColumn = [],
            showLoading, tableData, pageCount, currPageIndex,
            columnsData, totalElements, theme = 'ref-red',onFilterChange=()=>{},onFilterClear=()=>{} } = this.props;
        let { checkedArray, checkedMap } = this;
        let { selectedDataLength, tableIsSelecting } = this.state;
        let _tableData = tableData.map(item => {
            item._checked = checkedMap.hasOwnProperty(item[valueField]);
            return item;
        });
        checkedArray.forEach(item => {
            item._checked = true;
        });
        if (checkedArray.length === 0) {
            emptyBut = false;
        }
        return (
            <Modal
                show={showModal}
                className={` ${theme} ${className} ref-core ref-filter-table ref-core-modal`}
                backdrop={backdrop}
                size={size}
                onHide={this.handleBtnCancel}
                autoFocus={false}
            >
                <Modal.Header closeButton={true}>
                    <Modal.Title > {title}</Modal.Title>
                </Modal.Header >
                <Modal.Body ref={(ref) => this.modalRef = ref}>
                    <Loading container={this.modalRef} show={showLoading} />
                    <RefCoreTab
                        className="ref-filter-table-tab"
                        selectedData={checkedArray}
                        selectedDataLength={selectedDataLength}
                        selecteing={tableIsSelecting}
                        language={lang}
                        onSelectTabItem={_this.onSelectTabItem}
                    >
                    </RefCoreTab>
                    {
                        tableIsSelecting && (
                            <Pagination
                                first
                                last
                                prev
                                next
                                showJump={true}
                                boundaryLinks
                                className={pageCount > 1 ? '' : `ref-filter-table-pagination-hide`}
                                items={pageCount}
                                maxButtons={5}
                                total={totalElements}
                                activePage={currPageIndex}
                                onDataNumSelect={_this.props.dataNumSelect}
                                onSelect={_this.props.handlePagination}
                                locale={paginationLocale(lang)}
                            />
                        )
                    }
                    {
                        columnsData && columnsData.length ? React.createElement(_this.TableView, {
                            bordered: true,
                            scroll: { x: false, y: true },
                            columns: columnsData,
                            rowClassName: _this.renderRowClassName,
                            data: tableIsSelecting ? _tableData : checkedArray,
                            getSelectedDataFunc: _this.getSelectedDataFunc,
                            onRowDoubleClick: _this.onRowDoubleClick,
                            onRowClick: _this.onRowClick,
                            rowKey: _this.putRowKey,
                            columnFilterAble: false,
                            showFilterMenu: true,
                            onFilterChange:onFilterChange,
                            onFilterClear:onFilterClear,
                            filterDelay: 500,//输入文本多少ms触发回调函数，默认500m,
                            filterable: Boolean(filterColumn.length),//是否开启过滤数据功,
                        }) :
                            <RefCoreError show={!Boolean(_tableData.length)} language={lang} />
                    }


                </Modal.Body>
                <Modal.Footer className={'ref-core-modal-footer '}>
                    <RefCoreButton
                        language={lang}
                        buttons={buttons}
                        emptyBut={emptyBut}
                        onClickBtn={_this.onClickBtn}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}
export default RefFilterTableBaseUI;