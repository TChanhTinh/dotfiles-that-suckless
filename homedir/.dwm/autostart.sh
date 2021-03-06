#!/usr/bin/env sh
source $HOME/.dotfiles_var

{
    xrdb $HOME/.Xresources
    dwmblocks  &
    mpd &
    pulseaudio --start &
    nitrogen --set-zoom-fill --save $WALL_DIR/$(cat $CURRENT_WALL) &
    picom -b &
    dunst -conf $HOME/.config/dunst/dunstrc &
    lxpolkit &> /dev/null &
    ibus-daemon -drx &
} &> /dev/null
