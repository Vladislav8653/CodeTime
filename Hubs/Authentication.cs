using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class Authentication : Hub
    {
        public async Task GetUserInfo(string username, string password)
        {
            string filePath = "D:/users.txt";
            string field = "Login: " + username + " " + password;
            await AppendTextToFileAsync(filePath, field);
        }
        
        public async Task GetNewUserInfo(string username, string password)
        {
            string filePath = "D:/users.txt";
            string field = "New user: " + username + " " + password;
            await AppendTextToFileAsync(filePath, field);
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