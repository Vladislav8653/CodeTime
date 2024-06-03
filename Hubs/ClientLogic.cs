using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class ClientLogic : Hub
    {
        private readonly string _usersFilePath = "wwwroot/directories/users.txt";
        private readonly string _onlineUsersFilePath = "wwwroot/directories/onlineUsers.txt";
        private readonly string _videoPath = "wwwroot/directories/video.txt";
        private readonly Dictionary<string, string> _userConnections = new Dictionary<string, string>();
        
        
        public async Task GetUserInfo(string username, string password)
        {
            string[] fileContent = await File.ReadAllLinesAsync(_usersFilePath);
            foreach (var line in fileContent)
            {
                string[] words = line.Split(' ');
                if (words[1] == username && words[2] == password)
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "true");
                    await AppendTextToFileAsync(_onlineUsersFilePath, username + ' ' + Context.ConnectionId);
                    return;
                }
            }
            await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "false");
        }
        
        public async Task GetNewUserInfo(string username, string password)
        {
            string[] fileContent = await File.ReadAllLinesAsync(_usersFilePath);
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
            await AppendTextToFileAsync(_usersFilePath, field);
            await Clients.Client(Context.ConnectionId).SendAsync("CheckUser", "true");
            await AppendTextToFileAsync(_onlineUsersFilePath, username + ' ' + Context.ConnectionId);
        }
        
        public async Task GetVideo(string base64Video)
        {
            
            await AppendTextToFileAsync(_videoPath, base64Video);
            //string user = await File.ReadAllTextAsync("D:/1.txt");
            //await SendVideo(base64Video, user);
        }
        
        public async Task SendVideo(string base64Video, string user)
        {
            await AppendTextToFileAsync(_videoPath, "a");
            await Clients.Client(user).SendAsync("ReceiveVideo", base64Video);
        }
        
        public async Task AppendTextToFileAsync(string filePath, string text)
        {
            using (StreamWriter writer = new StreamWriter(filePath, true))
            {
                await writer.WriteLineAsync(text);
            }
        }

        public async Task A(string broadcastOwnerName)
        {
            string[] fileContent = await File.ReadAllLinesAsync(_onlineUsersFilePath);
            foreach (var line in fileContent)
            {
                string[] words = line.Split(' ');
                if (words[0] == broadcastOwnerName)
                {
                    await Clients.Client(Context.ConnectionId).SendAsync("ReceiveBroadcastOwnerId", words[1]);
                    return;
                }
            }
            await Clients.Client(Context.ConnectionId).SendAsync("ReceiveBroadcastOwnerId", "false");
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if (File.Exists(_videoPath))
                File.Delete(_videoPath);
            return base.OnDisconnectedAsync(exception);
        }
    }
}