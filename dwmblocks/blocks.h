//Modify this file to change what commands output to your statusbar, and recompile using the make command.
static const Block blocks[] = {
	/*Icon*/	/*Command*/		/*Update Interval*/	/*Update Signal*/
    {"", "~/.dwm/scripts/music-controller title", 10,		0},

    {"", "~/.dwm/scripts/status/main", 30,		0},


	{" ", "date '+%R'", 7,		0},
	//{" ", "date '+%b %d, %Y - %R'", 7,		0},
};

//sets delimeter between status commands. NULL character ('\0') means no delimeter.
static char delim[] = " | ";
static unsigned int delimLen = 15;
