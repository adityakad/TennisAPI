using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/tennis")]
public class TennisController : ControllerBase
{
    // Static datasets (temporary storage)
    private static List<Player> players = new List<Player>
    {
        new Player { Id = 1, Name = "Roger Federer", Rank = 1, Points = 9800 },
        new Player { Id = 2, Name = "Rafael Nadal", Rank = 2, Points = 9600 },
        new Player { Id = 3, Name = "Novak Djokovic", Rank = 3, Points = 9400 }
    };

    private static List<Match> matches = new List<Match>
    {
        new Match { Player1 = "Federer", Player2 = "Nadal", Winner = "Federer", Score = "6-4, 7-6" },
        new Match { Player1 = "Djokovic", Player2 = "Murray", Winner = "Djokovic", Score = "7-5, 6-3" }
    };

    // Get all players
    [HttpGet("players")]
    public IActionResult GetPlayers()
    {
        return Ok(players);
    }

    // Get all matches
    [HttpGet("matches")]
    public IActionResult GetMatches()
    {
        return Ok(matches);
    }
}

// Define Player & Match models
public class Player
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Rank { get; set; }
    public int Points { get; set; }
}

public class Match
{
    public string Player1 { get; set; }
    public string Player2 { get; set; }
    public string Winner { get; set; }
    public string Score { get; set; }
}
