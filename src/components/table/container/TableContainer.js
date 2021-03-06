import React, { Component } from 'react'
import '../assets/TableCard.scss'
import {fetchDataTable, saveDataTable} from '../service/TableService'
import { connect } from 'react-redux'
import {
    fetchingSuccess,
    handleInputCapacity,
    handleInputNumber,resetState
} from '../action/TableActions'
import Grid from '@material-ui/core/Grid'
import AddTable from '@material-ui/icons/AddBoxOutlined'
import TableCard from '../components/TableCard'
import TableCardDining from "../components/TableCardDining";
import Loader from 'react-loader-spinner'
import {handleKeypress} from "../../payment/action/Handle";

class TableContainer extends Component {
    constructor(props){
        super(props)
        this.state={
            fetchResult:
                {content: [],
                    total: null,
                    per_page: null,
                    current_page: 0
                },
            done: undefined
        }
    }

    componentDidMount(){
        setTimeout(() => {
            this.fetchingData(0).then(response => response )
            this.setState({ done: true });
        }, 3000);
    }

    fetchingData = async (pageNumbers) => {
        const resultData = await fetchDataTable(pageNumbers);
        if(!(resultData === undefined)){
            this.setState({
                fetchResult: {content: resultData.content}, total: resultData.totalElements,
                per_page: resultData.size,
                current_page: resultData.number
            })
        }
        this.props.dispatch({...fetchingSuccess, payload:resultData})
    };
    handleTableNumber=(event)=>{
        let data=event.target.value
        this.props.dispatch({...handleInputNumber, payload: data})
    }
    handleTableCapacity=(event)=>{
        let data=event.target.value
        this.props.dispatch({...handleInputCapacity, payload: data})
    }
    handleButtonSubmit= async  ()=>{
         await saveDataTable({...this.props.tableFormData}).then(this.props.dispatch({...resetState})).then(this.fetchingData(0))
        this.fetchingData(0)
    }
    render() {
        let dataTables, renderPageNumbers;
        if(this.state.fetchResult.content !== null){
            dataTables = this.state.fetchResult.content.map((dataTables, index) => {
                if (dataTables.status ==="AVAILABLE") {
                    return <TableCard dataTables={dataTables} key={index} number={index} renderTriger={this.fetchingData}/>
                }else if (dataTables.status ==="DINING"){
                    return <TableCardDining dataTables={dataTables} key={index} number={index}/>
                }
            })

        }
        const pageNumbers = [];
        if(this.state.total !== null){
            for(let i = 0; i <= Math.ceil(this.state.total / this.state.per_page -1); i++){
                pageNumbers.push(i);
            }

            renderPageNumbers = pageNumbers.map(numbers => {
                let page = this.state.current_page === numbers ? 'active' : '';
                return(
                    <span key={numbers} className={page} onClick={() => this.fetchingData(numbers)}>
                            {numbers+1}
                    </span>
                )
            })
        }

        return (
            <div className="container-fluid custom">
                <div className="custom-btn">
                    <button className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                        <AddTable/> <span>Add Table</span>
                    </button>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog " role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add New Table</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="user">
                                    <div className="form-group">
                                        <input type="number" className="form-control" min="1"
                                                placeholder="No. Table" onChange={this.handleTableNumber} required="true" value={this.props.tableFormData.numberTable} onKeyPress={handleKeypress}/>
                                    </div>
                                    <div className="form-group">
                                        <input type="number" className="form-control" min="1"
                                               placeholder="Capacity" onChange={this.handleTableCapacity} required="true" value={this.props.tableFormData.capacity} onKeyPress={handleKeypress}/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleButtonSubmit}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {!this.state.done ? (
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs

                    />
                ) : (

                <Grid container spacing={3}>
                    {dataTables}
                </Grid>
                )}
                <div>
                    <div className="pagination fixed-sticky">
                        <span onClick={() => this.fetchingData(0)}>&laquo;</span>
                        {renderPageNumbers}
                        <span onClick={() =>  this.fetchingData(0)} >&raquo;</span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)  => {
    return {
        ...state
    }
}

export default connect(mapStateToProps)(TableContainer)