import React, { Component } from 'react';
import RefFilterTableBaseUI from './components/RefFilterTableBaseUI';
import RefWithInput from 'ref-core/lib/refs/RefCoreWithInput';
import { createRefModal, createRefInput } from 'ref-core/lib/utils/createApi.js';
import RefCoreGlobal from 'ref-core/lib/refs/RefCoreGlobal';
import 'ref-core/css/refcore.css';
// import './index.less' //webpack打包需要放开
function RefFilterTable(props){
    return (
        <RefCoreGlobal {...props}>
            <RefFilterTableBaseUI />
        </RefCoreGlobal>
    )
}
function createRefMultipleTable(selector, props, callback){
    return createRefInput(selector, <RefFilterTableWithInput />, props , (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}
function createRefMultipleTableModal(props, callback){
    return createRefModal({
        component: <RefFilterTable />, 
        ...props 
    }, (param) => {
        if(typeof callback === 'function'){
            callback(param)
        }
        
    });
}

class RefFilterTableWithInput extends Component {
    render(){
        return (
            <RefWithInput {...this.props}>
                <RefFilterTable />
            </RefWithInput>
        )
    }
}

export default  RefFilterTableBaseUI;
export {
    RefFilterTableWithInput,
    RefFilterTable,
    createRefMultipleTable,  
    createRefMultipleTableModal,
}
