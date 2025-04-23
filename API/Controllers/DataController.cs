using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using API.Models;
using API;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        // GET: api/<ShopController> 
        [HttpGet(Name = "GetAllData")]

        public async Task <object[]> Get()
        {
            Database db = new ();            
            return await db.GetAllDataAsync();
        }

        // GET api/<ShopController>/5
        [HttpGet("{type}", Name = "GetOneSet")]
        public async Task<List<object>> Get(int type)
        {
            Database db = new ();
            List<Object> data = await db.GetDatasetAsync(type);
            return data;
        }

        // GET api/<ShopController>/5
        [HttpGet("{id}/{type}", Name = "GetOneInfo")]
        public async Task<object> Get(int id, int type)
        {
            Database db = new ();
            Object data = await db.GetDataAsync(id, type);
            return data;
        }

        // POST api/<ShopController>
    [HttpPost("{type}", Name = "AddOne")]
    public async Task<IActionResult> Post(int type, [FromBody] object newItem)
    {
        Database db = new();
        bool success = await db.AddDataAsync(type, newItem);

        if (success)
        {
            return Ok("Item added successfully.");
        }
        else
        {
            return BadRequest("Failed to add the item.");
        }
    }

    // PUT api/<ShopController>/5
    [HttpPut("{id}/{type}", Name = "UpdateOne")]
    public async Task<IActionResult> Put(int id, int type, [FromBody] object updatedItem)
    {
        Database db = new();
        bool success = await db.UpdateDataAsync(id, type, updatedItem);

        if (success)
        {
            return Ok("Item updated successfully.");
        }
        else
        {
            return NotFound("Item not found or failed to update.");
        }
    }

    // DELETE api/<ShopController>/5
    [HttpDelete("{id}/{type}", Name = "DeleteOne")]
    public async Task<IActionResult> Delete(int id, int type)
    {
        Database db = new();
        bool success = await db.DeleteDataAsync(id, type);

        if (success)
        {
            return Ok("Item deleted successfully.");
        }
        else
        {
            return NotFound("Item not found or failed to delete.");
        }
    }
    }
}
