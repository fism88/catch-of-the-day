import React from 'react';

class AddFishForm extends React.Component {
  createFish (event) {
    event.preventDefault();
    const fish = {
      name: this.name.value,
      price: this.price.value,
      status: this.status.value,
      desc: this.desc.value,
      image: this.image.value
    }

    this.props.addFish(fish);
    this.fishForm.reset();
  }

  render () {
    return (
      <form ref={(input) => this.fishForm = input } className="fish-edit" onSubmit={this.createFish.bind(this)}>
        <input ref={(input) => this.name} type="text" placeholder="Fish Name" />
        <input ref={(input) => this.price} type="text" placeholder="Fish Price" />
        <select ref={(input) => this.status}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea ref={(input) => this.desc} placeholder="Fish Desc"></textarea>
        <input ref={(input) => this.image} type="text" placeholder="Fish Image" />
        <button type="submit">+ Add Item</button>
      </form>
    )
  }
}

export default AddFishForm;
