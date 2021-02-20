//Modify this file to change what commands output to your statusbar, and recompile using the make command.
static const Block blocks[] = {
	/*Icon*/	/*Command*/		/*Update Interval*/	/*Update Signal*/
    {" ", "~/.dwm/scripts/music-controller title", 4,		0},

    {" ", "~/.dwm/scripts/status/network both", 10,		0},
    
    {" ", "echo $(cat /sys/class/power_supply/BAT0/capacity)%", 10,		0},
    
    {" ", "~/.dwm/scripts/status/temp", 2,		0},

	{" ", "date '+%b %d, %Y - %R'", 7,		0},
};

//sets delimeter between status commands. NULL character ('\0') means no delimeter.
static char delim[] = "  |  ";
static unsigned int delimLen = 5;
