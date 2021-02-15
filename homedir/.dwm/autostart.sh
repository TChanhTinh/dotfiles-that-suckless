#!/usr/bin/env sh
source $HOME/.owl4ce_var

{
    xrdb $HOME/.Xresources
    dwmblocks  &
    pulseaudio &
    nitrogen --set-zoom-fill --save $HOME/.wallpaper/mechanical/EPIC_2K.jpg &
    picom -b &
    dunst -conf $HOME/.config/dunst/dunstrc-mech-MINMOD &
    lxpolkit &> /dev/null &

} &> /dev/null
