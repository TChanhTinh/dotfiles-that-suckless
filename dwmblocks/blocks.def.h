//Modify this file to change what commands output to your statusbar, and recompile using the make command.
static const Block blocks[] = {
	/*Icon*/	/*Command*/		/*Update Interval*/	/*Update Signal*/
    {" ", "~/.config/tint2/executor/network status", 10,		0},
    
    {" ", "echo $(cat /sys/class/power_supply/BAT0/capacity)%", 10,		0},
    
    {" ", "~/.config/tint2/executor/temp", 2,		0},

	{" ", "date '+%b %d, %Y - %R'", 7,		0},
};

//sets delimeter between status commands. NULL character ('\0') means no delimeter.
static char delim[] = " | ";
static unsigned int delimLen = 5;
