using System.Text.Json;
using API.Models;
using Microsoft.Extensions.ObjectPool;
using MySqlConnector;

namespace API 
{
    public class Database
    {
        private string cs = "Server=t89yihg12rw77y6f.cbetxkdyhwsb.us-east-1.rds.amazonaws.com;User ID=off48goef0ulemt7;Password=sid95mjw7064tld5;Database=jaksf1wi5maqj0w4";
        public async Task<object[]> GetAllDataAsync()
        {
            
            var vendorsTask = GetAllVendorsAsync();
            var eventsTask = GetAllEventsAsync(); 
            var registrationsTask = GetAllRegistrationsAsync();
            var productsTask = GetAllProductsAsync();

            
            await Task.WhenAll(vendorsTask, eventsTask, registrationsTask, productsTask);

            
            object[] allData = new object[4];
            allData[0] = await vendorsTask;        
            allData[1] = await eventsTask;         
            allData[2] = await registrationsTask;  
            allData[3] = await productsTask;       

            return allData;
        }
        public async Task<List<Vendor>> GetAllVendorsAsync()
                {

                    List<Vendor> myVendors = new List<Vendor>();
                    
                    using var connection = new MySqlConnection(cs);
                    await connection.OpenAsync();

                    using var command = new MySqlCommand("SELECT * FROM jaksf1wi5maqj0w4.Vendors;", connection);

                    using var reader = await command.ExecuteReaderAsync();
                    while (await reader.ReadAsync())
                    {
                        myVendors.Add(new Vendor(){id = reader.GetInt32(0), Name = reader.GetString(1), Type = reader.GetString(2), Address = reader.GetString(3), Phone = reader.GetString(4), Email = reader.GetString(5), Website = reader.GetString(6), Username = reader.GetString(7), Password = reader.GetString(8)});

                    }
                    return myVendors;
                }
        public async Task<List<Event>> GetAllEventsAsync(){
            List<Event> myEvents = new List<Event>();

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM jaksf1wi5maqj0w4.Events;", connection);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                myEvents.Add(new Event()
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Date = reader.GetString(2),
                    Location = reader.GetString(3),
                });
            }
            return myEvents;
        }
        public async Task<List<Product>> GetAllProductsAsync()
        {
            List<Product> myProducts = new List<Product>();

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM jaksf1wi5maqj0w4.Products;", connection);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                myProducts.Add(new Product()
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.GetString(2),
                    VendorId = reader.GetInt32(3)
                });
            }
            return myProducts;
        }
        public async Task<List<Registration>> GetAllRegistrationsAsync()
        {
            List<Registration> myRegistrations = new List<Registration>();

            using var connection = new MySqlConnection(cs);
            await connection.OpenAsync();

            using var command = new MySqlCommand("SELECT * FROM jaksf1wi5maqj0w4.Registration;", connection);

            using var reader = await command.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                myRegistrations.Add(new Registration()
                {
                    Id = reader.GetInt32(0),
                    VendorId = reader.GetInt32(1),
                    ProductId = reader.GetInt32(2),
                    EventId = reader.GetInt32(3)

                });
            }
            return myRegistrations;
        }
        public async Task<object> GetDataAsync(int id, int type)
        {
            try{
                object[] data = await GetAllDataAsync();
                switch (type)
                {
                    case 0:
                        System.Console.WriteLine("Done");
                        return ((List<Vendor>)data[0]).FirstOrDefault(v => v.id == id);
                    case 1:
                        return ((List<Event>)data[1]).FirstOrDefault(e => e.Id == id);
                    case 2:
                        return ((List<Product>)data[3]).FirstOrDefault(p => p.Id == id);
                    case 3:
                        return ((List<Registration>)data[2]).FirstOrDefault(r => r.Id == id);
                    default:
                        throw new ArgumentException("Invalid type");
                }
            } catch {
                return null;
            }
        }
        public async Task<List<object>> GetDatasetAsync(int type)
        {
            try{
                object[] data = await GetAllDataAsync();
                switch (type)
                {
                    case 0:
                        List<object> VendorList = data[0] as List<object>;
                        return VendorList;
                    case 1:
                        List<object> EventList = data[1] as List<object>;
                        return EventList;
                    case 2:
                        List<object> ProductList = data[2] as List<object>;
                        return ProductList;
                    case 3:
                        List<object> RegistrationList = data[3] as List<object>;
                        return RegistrationList;
                    default:
                        throw new ArgumentException("Invalid type");
                }
            } catch {
                return null;
            }
        }


        public async Task<bool> AddDataAsync(int type, object newItem)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string query = type switch
                {
                    0 => "INSERT INTO jaksf1wi5maqj0w4.Vendors (Name, Type, Address, Phone, Email, Website, Username, Password) VALUES (@Name, @Type, @Address, @Phone, @Email, @Website, @Username, @Password);",
                    1 => "INSERT INTO jaksf1wi5maqj0w4.Events (Name, Date, Location) VALUES (@Name, @Date, @Location);",
                    2 => "INSERT INTO jaksf1wi5maqj0w4.Products (Name, Description, VendorId) VALUES (@Name, @Description, @VendorId);",
                    3 => "INSERT INTO jaksf1wi5maqj0w4.Registration (VendorId, ProductId, EventId ) VALUES (@VendorId, @ProductId, @EventId);",
                    _ => throw new ArgumentException("Invalid type")
                };

                using var command = new MySqlCommand(query, connection);

                switch (type)
                {
                    case 0: 
                        var vendor = System.Text.Json.JsonSerializer.Deserialize<Vendor>(newItem.ToString());
                        command.Parameters.AddWithValue("@Name", vendor.Name);
                        command.Parameters.AddWithValue("@Type", vendor.Type);
                        command.Parameters.AddWithValue("@Address", vendor.Address);
                        command.Parameters.AddWithValue("@Phone", vendor.Phone);
                        command.Parameters.AddWithValue("@Email", vendor.Email);
                        command.Parameters.AddWithValue("@Website", vendor.Website);
                        command.Parameters.AddWithValue("@Username", vendor.Username);
                        command.Parameters.AddWithValue("@Password", vendor.Password);
                        break;

                    case 1: 
                        var eventItem = System.Text.Json.JsonSerializer.Deserialize<Event>(newItem.ToString());
                        command.Parameters.AddWithValue("@Name", eventItem.Name);
                        command.Parameters.AddWithValue("@Date", eventItem.Date);
                        command.Parameters.AddWithValue("@Location", eventItem.Location);
                        break;

                    case 2: 
                        var product = System.Text.Json.JsonSerializer.Deserialize<Product>(newItem.ToString());
                        command.Parameters.AddWithValue("@Name", product.Name);
                        command.Parameters.AddWithValue("@Description", product.Description);
                        command.Parameters.AddWithValue("@VendorId", product.VendorId);
                        break;

                    case 3: 
                        var registration = System.Text.Json.JsonSerializer.Deserialize<Registration>(newItem.ToString());
                        command.Parameters.AddWithValue("@EventId", registration.EventId);
                        command.Parameters.AddWithValue("@VendorId", registration.VendorId);
                        command.Parameters.AddWithValue("@ProductId", registration.ProductId);
                        break;
                }

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error in AddDataAsync: {ex.Message}");
                return false;
            }
        }
        public async Task<bool> UpdateDataAsync(int id, int type, object updatedItem)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string query = type switch
                {
                    0 => "UPDATE jaksf1wi5maqj0w4.Vendors SET Name = @Name, Type = @Type, Address = @Address, Phone = @Phone, Email = @Email, Website = @Website, Username = @Username, Password = @Password, WHERE id = @Id;",
                    1 => "UPDATE jaksf1wi5maqj0w4.Events SET Name = @Name, Date = @Date, Location = @Location, Description = @Description WHERE id = @Id;",
                    2 => "UPDATE jaksf1wi5maqj0w4.Products SET Name = @Name, Price = @Price, Description = @Description, VendorId = @VendorId WHERE id = @Id;",
                    3 => "UPDATE jaksf1wi5maqj0w4.Registration SET EventId = @EventId, UserId = @UserId, RegistrationDate = @RegistrationDate, Status = @Status WHERE id = @Id;",
                    _ => throw new ArgumentException("Invalid type")
                };

                using var command = new MySqlCommand(query, connection);

                if(id == 1){
                    id = -1;
                }
                command.Parameters.AddWithValue("@Id", id);
                switch (type)
                {
                    case 0: 
                        var vendor = (Vendor)updatedItem;
                        command.Parameters.AddWithValue("@Name", vendor.Name);
                        command.Parameters.AddWithValue("@Type", vendor.Type);
                        command.Parameters.AddWithValue("@Address", vendor.Address);
                        command.Parameters.AddWithValue("@Phone", vendor.Phone);
                        command.Parameters.AddWithValue("@Email", vendor.Email);
                        command.Parameters.AddWithValue("@Website", vendor.Website);
                        command.Parameters.AddWithValue("@Username", vendor.Username);
                        command.Parameters.AddWithValue("@Password", vendor.Password);
                        break;

                    case 1: 
                        var eventItem = (Event)updatedItem;
                        command.Parameters.AddWithValue("@Name", eventItem.Name);
                        command.Parameters.AddWithValue("@Date", eventItem.Date);
                        command.Parameters.AddWithValue("@Location", eventItem.Location);
                        break;

                    case 2: 
                        var product = (Product)updatedItem;
                        command.Parameters.AddWithValue("@Name", product.Name);
                        command.Parameters.AddWithValue("@Description", product.Description);
                        command.Parameters.AddWithValue("@VendorId", product.VendorId);
                        break;

                    case 3: 
                        var registration = (Registration)updatedItem;
                        command.Parameters.AddWithValue("@EventId", registration.EventId);
                        command.Parameters.AddWithValue("@VendorId", registration.VendorId);
                        command.Parameters.AddWithValue("@SProductId", registration.ProductId);
                        break;
                }

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> DeleteDataAsync(int id, int type)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string query = type switch
                {
                    0 => "DELETE FROM jaksf1wi5maqj0w4.Vendors WHERE id = @Id;",
                    1 => "DELETE FROM jaksf1wi5maqj0w4.Events WHERE EventId = @Id;",
                    2 => "DELETE FROM jaksf1wi5maqj0w4.Products WHERE ProductId = @Id;",
                    3 => "DELETE FROM jaksf1wi5maqj0w4.Registration WHERE RegistrationId = @Id;",
                    _ => throw new ArgumentException("Invalid type")
                };

                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", id);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch
            {
                return false;
            }
        }
        public async Task<bool> UpdateEventAsync(int eventId, Event updatedEvent)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string query = "UPDATE jaksf1wi5maqj0w4.Events SET Name = @Name, Date = @Date, Location = @Location WHERE EventId = @Id;";

                using var command = new MySqlCommand(query, connection);
                command.Parameters.AddWithValue("@Id", eventId);
                command.Parameters.AddWithValue("@Name", updatedEvent.Name);
                command.Parameters.AddWithValue("@Date", updatedEvent.Date);
                command.Parameters.AddWithValue("@Location", updatedEvent.Location);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateEventAsync: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> UpdateAccountAsync(Vendor updatedItem)
        {
            try
            {
                using var connection = new MySqlConnection(cs);
                await connection.OpenAsync();

                string query = "UPDATE jaksf1wi5maqj0w4.Vendors SET Name = @Name, Type = @Type, Address = @Address, Phone = @Phone, Email = @Email, Website = @Website, Username = @Username, Password = @Password, WHERE id = @Id;";
                
                using var command = new MySqlCommand(query, connection);
                Vendor vendor = updatedItem;
                int id = -1;
                command.Parameters.AddWithValue("@Id", id);
                command.Parameters.AddWithValue("@Name", vendor.Name);
                command.Parameters.AddWithValue("@Type", vendor.Type);
                command.Parameters.AddWithValue("@Address", vendor.Address);
                command.Parameters.AddWithValue("@Phone", vendor.Phone);
                command.Parameters.AddWithValue("@Email", vendor.Email);
                command.Parameters.AddWithValue("@Website", vendor.Website);
                command.Parameters.AddWithValue("@Username", vendor.Username);
                command.Parameters.AddWithValue("@Password", vendor.Password);

                int rowsAffected = await command.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateEventAsync: {ex.Message}");
                return false;
            }
        }
    }
}
