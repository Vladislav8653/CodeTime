using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class ClientLogic : Hub
    {
        private string filePath = "D:/users.txt";
        public async Task GetUserInfo(string username, string password)
        {
            string[] fileContent = await File.ReadAllLinesAsync(filePath);
            foreach (var line in fileContent)
            {
                string[] words = line.Split(' ');
                if (words[1] == username && words[2] == password)
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "true");
                    return;
                }
            }
            await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "false");
        }
        
        public async Task GetNewUserInfo(string username, string password)
        {
            string[] fileContent = await File.ReadAllLinesAsync(filePath);
            foreach (var line in fileContent)
            {
                string[] words = line.Split(' ');
                if (words[1] == username)
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "false_exist");
                    return;
                }
            }
            string field = "New_user: " + username + " " + password;
            await AppendTextToFileAsync(filePath, field);
            await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "true");
        }
        
        public async Task GetVideo(string base64Video)
        {
            string filePath = "D:/video.txt";
            await AppendTextToFileAsync(filePath, base64Video);
            await SendVideo(base64Video);
        }
        
        public async Task SendVideo(string base64Video)
        {
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveVideo", base64Video);
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