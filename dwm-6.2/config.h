/* See LICENSE file for copyright and license details. */

/* appearance */
static const unsigned int borderpx = 1;        /* border pixel of windows */
static const unsigned int gappx    = 10;       /* gap pixel between windows */
static const unsigned int snap     = 32;       /* snap pixel */
static const unsigned int minwsz    = 0;
static const int showbar            = 1;        /* 0 means no bar */
static const int topbar             = 1;        /* 0 means bottom bar */
static const int horizpadbar        = -7;        /* horizontal padding for statusbar */
static const int vertpadbar         = 7;        /* vertical padding for statusbar */
static const char *fonts[]          = { "Font Awesome 5 Free:size=13", "Font Awesome 5 Free:size=11" };
static const char dmenufont[]       = "Font Awesome 5 Free:size=13";
/*static const char col_gray1[]       = "#3B4252";
static const char col_gray2[]       = "#434C5E";
static const char col_gray3[]       = "#E6BAFF";
static const char col_gray4[]       = "#F9F9F9";
static const char col_cyan[]        = "#FA5AA4";
static const char *colors[][3]      = {
	/*               fg         bg         border   */
/*	[SchemeNorm] = { col_gray3, col_gray1, col_gray2 },
	[SchemeSel]  = { col_gray4, col_cyan,  col_cyan  },
	[SchemeHid]  = { col_cyan,  col_gray1, col_cyan  },
};*/

#include "/home/tchanhtinh/.cache/wal/colors-wal-dwm.h"

/* tagging */
static const char *tags[] = { "₁", "₂", "₃", "₄", "₅" };

static const Rule rules[] = {
	/* xprop(1):
	 *	WM_CLASS(STRING) = instance, class
	 *	WM_NAME(STRING) = title
	 */
	/* class      instance    title       tags mask     isfloating   monitor */
	{ "Gimp",     NULL,       NULL,       0,            1,           -1 },
	{ "Firefox",  NULL,       NULL,       1 << 8,       0,           -1 },
};

/* layout(s) */
static const float mfact     = 0.50; /* factor of master area size [0.05..0.95] */
static const float smfact    = 0.00;
static const int nmaster     = 1;    /* number of clients in master area */
static const int resizehints = 0;    /* 1 means respect size hints in tiled resizals */

static const Layout layouts[] = {
	/* symbol     arrange function */
	{ "ₖ",      tile },    /* first entry is default */
	{ "ₙ",      NULL },    /* no layout function means floating behavior */
	{ "ₘ",      monocle },
};

/* key definitions */
#define MODKEY Mod4Mask
#define TAGKEYS(KEY,TAG) \
	{ MODKEY,                       KEY,      view,           {.ui = 1 << TAG} }, \
	{ MODKEY|ControlMask,           KEY,      toggleview,     {.ui = 1 << TAG} }, \
	{ MODKEY|ShiftMask,             KEY,      tag,            {.ui = 1 << TAG} }, \
	{ MODKEY|ControlMask|ShiftMask, KEY,      toggletag,      {.ui = 1 << TAG} },

/* helper for spawning shell commands in the pre dwm-5.0 fashion */
#define SHCMD(cmd) { .v = (const char*[]){ "/bin/sh", "-c", cmd, NULL } }

/* commands */
static char dmenumon[2] = "0"; /* component of dmenucmd, manipulated in spawn() */
static const char *dmenucmd[] = { "bash", "-c", "$HOME/.config/rofi/scripts/appsmenu.sh", NULL };
static const char *volupcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/notify/change-volume.sh up", NULL };
static const char *voldowncmd[] = { "bash", "-c", "$HOME/.dwm/scripts/notify/change-volume.sh down", NULL };
static const char *volmutecmd[] = { "bash", "-c", "$HOME/.dwm/scripts/notify/change-volume.sh mute", NULL };
static const char *brightupcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/notify/change-brightness.sh up", NULL };
static const char *brightdowncmd[] = { "bash", "-c", "$HOME/.dwm/scripts/notify/change-brightness.sh down", NULL };
static const char *playernextcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/music-controller next", NULL };
static const char *playerprevcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/music-controller prev", NULL };
static const char *playerstopcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/music-controller stop", NULL };
static const char *playertogglecmd[] = { "bash", "-c", "$HOME/.dwm/scripts/music-controller toggle", NULL };
static const char *screenshotcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/shot-now", NULL };
static const char *screenshotdrwcmd[] = { "bash", "-c", "$HOME/.dwm/scripts/shot-seldraw", NULL };
static const char *termcmd[]  = { "kitty", NULL };
static const char *filecmd[] = { "thunar", NULL };

#include <X11/XF86keysym.h>
static Key keys[] = {
	/* modifier                     key        function        argument */
	{ 0,                       XF86XK_AudioRaiseVolume,      spawn,    {.v = volupcmd } },
    { 0,                       XF86XK_AudioLowerVolume,      spawn,          {.v = voldowncmd } },
    { 0,                       XF86XK_AudioMute,      spawn,          {.v = volmutecmd } },
    
    { 0,                       XK_Print,      spawn,          {.v = screenshotcmd } },
    { ShiftMask,                       XK_Print,      spawn,          {.v = screenshotdrwcmd } },
    
	{ 0,                       XF86XK_AudioNext,      spawn,    {.v = playernextcmd } },
    { 0,                       XF86XK_AudioPrev,      spawn,          {.v = playerprevcmd } },
    { 0,                       XF86XK_AudioPlay,      spawn,          {.v = playertogglecmd } },
    { 0,                       XF86XK_AudioStop,      spawn,          {.v = playerstopcmd } },
    
	{ 0,                       XF86XK_MonBrightnessUp,      spawn,    {.v = brightupcmd } },
    { 0,                       XF86XK_MonBrightnessDown,      spawn,          {.v = brightdowncmd } },
    
	{ MODKEY,                       XK_r,      spawn,          {.v = dmenucmd } },
	{ MODKEY,                       XK_t, spawn,          {.v = termcmd } },
    { MODKEY,                       XK_e,      spawn,          {.v = filecmd } },
	{ MODKEY,                       XK_b,      togglebar,      {0} },
	{ MODKEY,                       XK_d,      focusstackvis,  {.i = +1 } },
	{ MODKEY,                       XK_Tab,      focusstackvis,  {.i = +1 } },
	{ MODKEY,                       XK_a,      focusstackvis,  {.i = -1 } },
	{ MODKEY|ShiftMask,             XK_Left,      focusstackhid,  {.i = +1 } },
	{ MODKEY|ShiftMask,             XK_Right,      focusstackhid,  {.i = -1 } },
	{ MODKEY,                       XK_h,      incnmaster,     {.i = +1 } },
	{ MODKEY,                       XK_v,      incnmaster,     {.i = -1 } },
	{ MODKEY|ShiftMask,             XK_a,   setmfact,       {.f = -0.05} },
	{ MODKEY|ShiftMask,             XK_d,  setmfact,       {.f = +0.05} },
    { MODKEY|ShiftMask,             XK_s,   setsmfact,       {.f = -0.05} },
	{ MODKEY|ShiftMask,             XK_w,  setsmfact,       {.f = +0.05} },
	{ MODKEY,                       XK_z,      zoom,           {0} },
	{ MODKEY,                       XK_sacute,    view,           {0} },
	{ MODKEY,                       XK_c,      killclient,     {0} },
	{ MODKEY,                       XK_k,      setlayout,      {.v = &layouts[0]} },
	{ MODKEY,                       XK_n,      setlayout,      {.v = &layouts[1]} },
	{ MODKEY,                       XK_m,      setlayout,      {.v = &layouts[2]} },
	{ MODKEY,                       XK_x,  setlayout,      {0} },
	{ MODKEY|ShiftMask,             XK_space,  togglefloating, {0} },
	{ MODKEY,                       XK_0,      view,           {.ui = ~0 } },
	{ MODKEY|ShiftMask,             XK_0,      tag,            {.ui = ~0 } },
	{ MODKEY,                       XK_comma,  focusmon,       {.i = -1 } },
	{ MODKEY,                       XK_period, focusmon,       {.i = +1 } },
	{ MODKEY|ShiftMask,             XK_comma,  tagmon,         {.i = -1 } },
	{ MODKEY|ShiftMask,             XK_period, tagmon,         {.i = +1 } },
	{ MODKEY|ShiftMask,                       XK_s,      show,           {0} },
	{ MODKEY|ShiftMask,                       XK_h,      hide,           {0} },
	TAGKEYS(                        XK_1,                      0)
	TAGKEYS(                        XK_2,                      1)
	TAGKEYS(                        XK_3,                      2)
	TAGKEYS(                        XK_4,                      3)
	TAGKEYS(                        XK_5,                      4)
	TAGKEYS(                        XK_6,                      5)
	TAGKEYS(                        XK_7,                      6)
	TAGKEYS(                        XK_8,                      7)
	TAGKEYS(                        XK_9,                      8)
	{ MODKEY|ShiftMask,             XK_q,      quit,           {0} },
	{ MODKEY|ShiftMask,             XK_r,      quit,           {1} }, 
};

/* button definitions */
/* click can be ClkTagBar, ClkLtSymbol, ClkStatusText, ClkWinTitle, ClkClientWin, or ClkRootWin */
static Button buttons[] = {
	/* click                event mask      button          function        argument */
	{ ClkLtSymbol,          0,              Button1,        setlayout,      {0} },
	{ ClkLtSymbol,          0,              Button3,        setlayout,      {.v = &layouts[2]} },
	{ ClkWinTitle,          0,              Button1,        togglewin,      {0} },
	{ ClkWinTitle,          0,              Button2,        zoom,           {0} },
	{ ClkStatusText,        0,              Button1,        sigdwmblocks,   {.i = 1} },
	{ ClkStatusText,        0,              Button2,        sigdwmblocks,   {.i = 2} },
	{ ClkStatusText,        0,              Button3,        sigdwmblocks,   {.i = 3} },
	{ ClkClientWin,         MODKEY,         Button1,        movemouse,      {0} },
	{ ClkClientWin,         MODKEY,         Button2,        togglefloating, {0} },
	{ ClkClientWin,         MODKEY,         Button3,        resizemouse,    {0} },
	{ ClkTagBar,            0,              Button1,        view,           {0} },
	{ ClkTagBar,            0,              Button3,        toggleview,     {0} },
	{ ClkTagBar,            MODKEY,         Button1,        tag,            {0} },
	{ ClkTagBar,            MODKEY,         Button3,        toggletag,      {0} },
};