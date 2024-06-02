export const connection = new signalR.HubConnectionBuilder().withUrl("/ClientLogic").build();

alert("Connection defined.")
