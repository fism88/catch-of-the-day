import React from 'react';

import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
  constructor () {
    super();

    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);

    this.state = {
      uid: null,
      owner: null
    }
  }

  componentDidMount () {
    base.onAuth((user) => {
      if (user) {
        this.authHandler(null, { user });
      }
    });
  }

  handleChange (event, key) {
    const fish  = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [event.target.name]: event.target.value
    }

    this.props.updateFish(key, updatedFish);
  }

  authenticate (provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler (err, authData) {
    if (err) {
      console.error(err);
      return;
    }

    const storeRef = base.database().ref(this.props.storeId);
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      if (!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });
  }

  logout () {
    base.unauth();
    this.setState({ uid: null });
  }

  renderLogin () {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log In with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Log In with Twitter</button>
      </nav>
    )
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
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  render () {
    const logout = <button onClick={() => this.logout()}>Log Out</button>;
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store.</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        <AddFishForm addFish={ this.props.addFish }/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
        <br/><br/>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
      </div>
    )
  }
}

Inventory.propTypes = {
  addFish: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
  updateFish: React.PropTypes.func.isRequired
};

export default Inventory;
