import React from 'react';

import AddFishForm from './AddFishForm';

class Inventory extends React.Component {
  constructor () {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
  }

  handleChange (event, key) {
    const fish  = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [event.target.name]: event.target.value
    }

    this.props.updateFish(key, updatedFish);
  }

  renderInventory (key) {
    const fish = this.props.fishes[key];

    return (
      <div className='fish-edit' key={key}>
        <input name="name" value={fish.name} type="text" placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)}/>
        <input name="price" value={fish.price} type="text" placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)}/>
        <select name="status" value={fish.status} onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
        <input name="image" value={fish.image} type="text" placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)}/>
      </div>
    )
  }

  render () {
    return (
      <div>
        <h2>Inventory</h2>
        <AddFishForm addFish={ this.props.addFish }/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        <br/><br/>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
      </div>
    )
  }
}

export default Inventory;
