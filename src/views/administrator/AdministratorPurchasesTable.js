import {Button, message, Table, Input, Form, Divider} from 'antd';
import React, {Component, createContext} from 'react';
import {getData, putData} from "../../http";


const EditableContext = createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


class EditableCell extends Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({editing}, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({...record, ...values});
        });
    };

    renderCell = form => {
        this.form = form;
        const {children, dataIndex, record, title} = this.props;
        const {editing} = this.state;
        return editing ? (
            <Form.Item style={{margin: 0}}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save}/>)}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{paddingRight: 24}}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}

class AdministratorPurchasesTable extends Component {

    state = {
        loading: true,
        dataSource: [],
    };

    columns = [
        {
            title: 'Number',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Administrator',
            dataIndex: 'administratorLogin',
            key: 'administratorLogin',
        },
        {
            title: 'Manager',
            dataIndex: 'managerLogin',
            key: 'managerLogin',
        },
        {
            title: 'Supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            width: '30%',
            editable: true,
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: products => Object.entries(products)
                .map(([key, value], i) => <span key={i}> {`${key}: ${value}`} </span>),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {record.status === 'IN_PROGRESS' &&
                    <Button type='primary' onClick={this.completePurchase(record)}>Complete purchase</Button>}
                    <Divider type="vertical"/>
                    {record.status === 'IN_PROGRESS' &&
                    <Button type='danger' onClick={this.failPurchase(record)}>Close purchase with fail</Button>}
                </div>
            ),
        },
    ];

    completePurchase = (purchase) => (e) => {
        purchase.status = 'DONE';
        putData(`api/purchase/${purchase.id}`, purchase)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to complete purchase ${purchase.id}`)
                }
            })
            .catch(ex => {
                // message.error(`Error when complete purchase ${ex}`))
                this.refreshTableData()
            })
    };

    failPurchase = (purchase) => (e) => {
        purchase.status = 'NOT_DONE';
        putData(`api/purchase/${purchase.id}`, purchase)
            .then(result => {
                if (result.status === 200) {
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to complete purchase ${purchase.id}`)
                }
            })
            .catch(ex => {
                // message.error(`Error when complete purchase ${ex}`))
                this.refreshTableData()
            })
    };

    getData = callback => {
        getData('api/purchase/')
            .then(result => {
                if (result.status === 200) {
                    callback(result.data)
                }
            })
    };

    refreshTableData = () => {
        this.getData(res => {
            this.setState({
                loading: false,
                dataSource: res,
            });
        });
    };

    componentDidMount() {
        this.refreshTableData()
    }

    handleSave = (purchase) => {
        purchase.status = 'IN_PROGRESS';
        putData(`api/purchase/${purchase.id}`, purchase)
            .then(result => {
                if (result.status === 200) {
                    console.log('success!!!!!');
                    this.refreshTableData()
                } else {
                    message.warning(`Unable to update purchase ${purchase.id}`)
                }
            })
            .catch(ex => {
                // message.error(`Error when update purchase ${ex}`);
                this.refreshTableData()
            })
    };

    render() {
        const {loading, dataSource} = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Table
                    loading={loading}
                    components={components}
                    rowClassName={() => 'editable-row'}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey={(record) => record.id}
                />
            </div>
        );
    }
}

export default AdministratorPurchasesTable