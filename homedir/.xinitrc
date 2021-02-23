!/bin/bash

session=${1:-openbox}

case $session in
    openbox         ) exec openbox;;
    dwm             ) exec dwm;;
    *               ) exec $1;;
esac
