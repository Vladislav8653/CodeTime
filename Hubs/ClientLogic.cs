using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class ClientLogic : Hub
    {
        public async Task GetUserInfo(string username, string password)
        {
            
        }
        //[HubMethodName("GetVideo")]
        public async Task GetVideo(string user, string base64Video)
        {
            string filePath = "D:/video.txt";
            await AppendTextToFileAsync(filePath, base64Video);
            await SendVideo(user, base64Video);
        }
        
        public async Task SendVideo(string user, string base64Video)
        {
            await Clients.All.SendAsync("ReceiveVideo", user, base64Video);
        }
        
        public async Task AppendTextToFileAsync(string filePath, string text)
        {
            using (StreamWriter writer = new StreamWriter(filePath, true))
            {
                await writer.WriteLineAsync(text);
            }
        }
    }
}