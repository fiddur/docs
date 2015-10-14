var TenantSwitcher = React.createClass({
  getInitialState: function () {
    return {
      tenant: this.props.tenants[0],
      client: this.props.tenants[0].clients[0]
    };
  },
  getClients: function() {
    var clientArray = this.state.tenant.clients;
    var list = [];

    clientArray.forEach(function(client, i) {
      list.push(
        <option key={i} value={i}>{client.name}</option>
      );
    });

    return list;
  },
  getTenants: function() {
    var tenants = this.props.tenants;
    var list = [];

    tenants.forEach(function(item, i) {
      list.push(
        <option key={i} value={i}>{item.tenant}</option>
      );
    });

    return list;
  },
  onClientChange: function(event) {
    var currentClient = this.state.tenant.clients[event.target.value];

    this.setState({
      client: currentClient
    });

    this.props.updateTutorial({
      clientID: currentClient.clientID
    });
  },
  onTenantChange: function(event) {
    var currentTenant = this.props.tenants[event.target.value];

    this.setState({
      tenant: currentTenant,
      client: currentTenant.clients[0]
    });

    this.props.updateTutorial({
      clientID: currentTenant.clients[0].clientID
    });
  },
  render: function() {
    var cssClass = (this.props.tutorial.appType) ? 'hide tenant-switcher' : 'tenant-switcher';

    return (
      <div key={this.props.tutorial.appType} className={cssClass}>
        <div className="text">Choose an account or application to customize your Tutorials</div>
        <span className="icon icon-budicon-300"></span>
        <div className="custom-select">
          <span data-select-value>{this.state.tenant.tenant} <i className="icon-budicon-460"></i></span>
          <select name="tenant" onChange={this.onTenantChange}>
            {this.getTenants()}
          </select>
        </div>
        <span className="icon icon-budicon-375"></span>
        <div className="custom-select">
          <span data-select-value>{this.state.client.name} <i className="icon-budicon-460"></i></span>
          <select name="app" onChange={this.onClientChange}>
            {this.getClients()}
          </select>
        </div>
      </div>
    );
  }
});

export default TenantSwitcher;
