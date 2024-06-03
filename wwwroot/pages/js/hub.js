class Hub {
    static instance = null;

    constructor() {
        if (Hub.instance) {
            return Hub.instance;
        }
        this.connection = new signalR.HubConnectionBuilder().withUrl("/ClientLogic").build();
        this.connection.start();
        Hub.instance = this;
    }

    getConnection() {
        return this.connection;
    }
}
