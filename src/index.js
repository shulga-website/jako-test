import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Sklad extends React.Component {
    constructor(props){
        super(props);
        var goods_array = [];
        var total_quantity = 0;
        for (let i = 0; i < 300; i++) {
            let id = i + 1;
            let name = 'Позиция №' + id;
            let price_rand = Math.floor(Math.random() * 1000);
            let price = (price_rand == 0) ? 100 : price_rand;
            let quantity = Math.floor(Math.random() * 30);
            total_quantity += quantity;
            goods_array.push({
                id: id,
                name: name,
                price: price,
                quantity: quantity,
            });
        }
        this.state = {
            positions: goods_array,
            new_position: {
                id: goods_array.length + 1,
                name: '',
                price: 0,
                quantity: 0,
            },
            total_quantity: total_quantity,
        };
        this.newPositionHandleChange = this.newPositionHandleChange.bind(this);
        this.positionHandleChange = this.positionHandleChange.bind(this);
        this.addPosition = this.addPosition.bind(this);
    }
    
    calculateTotal() {
        const positions = this.state.positions;
        var total = 0;
        positions.map(function(item){
            total += parseInt(item.quantity);
        });
        this.setState({
            total_quantity: total
        });
    }
    
    positionHandleChange(evt){
        const position_id = evt.target.getAttribute('data_pos_id');
        const val_name = evt.target.name;
        const value = evt.target.value;
        
        var newPpositions = this.state.positions.slice();
        const index = position_id - 1;
        newPpositions[index][val_name] = value;
        this.setState(prevState => ({
            positions: newPpositions,
        }))
        console.log('Позиция изменена: ');
        console.log(newPpositions[index]);
        this.calculateTotal();
    }
    
    handleClick(id) {
        this.setState({positions: this.state.positions.filter(function(item) { 
            return item.id !== id
        })});
    }
    
    newPositionHandleChange (evt) {
        this.setState(prevState => ({
            new_position: {
                ...prevState.new_position,
                [evt.target.name]: evt.target.value
            }
        }))
    }
    
    addPosition(e) {
        e.preventDefault();
        const positions = this.state.positions.slice();
        const newPositions = positions.concat([this.state.new_position])
        const total = this.state.total_quantity;
        this.setState(prevState => ({
            positions: newPositions,
            new_position: {
                id: newPositions.length + 1 ,
                name: '',
                price: 0,
                quantity: 0,
            },
            total_quantity: parseInt(total) + parseInt(this.state.new_position.quantity)
        }))
    }
    
  render() {
    return (
        <div className="sklad">
            <div className="info">
                <div>Добавить</div>
                <form onSubmit={this.addPosition}>
                    <input type="text" name="name" value={this.state.new_position.name} placeholder="Наименование" onChange={this.newPositionHandleChange} />
                    <input type="number" name="price" value={this.state.new_position.price} placeholder="Цена" onChange={this.newPositionHandleChange} />
                    <input type="number" name="quantity" value={this.state.new_position.quantity} placeholder="Остаток" onChange={this.newPositionHandleChange} />
                    <button type="submit" className="postition">
                        +
                    </button>
                </form>
            </div>
        <div className="table">
            Всего на складе: {this.state.total_quantity}
            <SkladTable 
                positions={this.state.positions} 
                editFunc={this.positionHandleChange}
                onClick={(i) => this.handleClick(i)} 
            />
        </div>
      </div>
    );
  }
}

class SkladTable extends React.Component {
    render() {
        const rows = [];
        for (let i = 0; i < this.props.positions.length; i++) {
            rows.push(<Position key={this.props.positions[i].id} value={this.props.positions[i]} onClick={() => this.props.onClick(this.props.positions[i].id)} editFunc={this.props.editFunc} />);
        }
        return (
            <table>
                <thead>
                    <tr>
                        <th>Наименование</th>
                        <th>Цена</th>
                        <th>Остаток</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}

function Position(props){        
    return (
        <tr>
            <td><input type="text" name="name" value={props.value.name} placeholder="Наименование" data_pos_id={props.value.id} onChange={props.editFunc} /></td>
            <td><input type="text" name="price" value={props.value.price} placeholder="Цена" data_pos_id={props.value.id} onChange={props.editFunc} /></td>
            <td><input type="text" name="quantity" value={props.value.quantity} placeholder="Остаток" data_pos_id={props.value.id} onChange={props.editFunc} /></td>
            <td>
                <button className="postition" onClick={props.onClick}>
                    X
                </button>
            </td>
        </tr>
    );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Sklad />);
