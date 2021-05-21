# Clean & Suckless dotfiles
Now using Pywal & Wpgtk to change color scheme match wallpaper with Wally script (Need rebuild and restart Dwm)
<p align="center"><img src="https://raw.githubusercontent.com/TChanhTinh/dotfiles-that-suckless/main/screenshots/2021-03-07-141305_1366x768_scrot.png"/></p>
<p align="center"><img src="https://raw.githubusercontent.com/TChanhTinh/dotfiles-that-suckless/main/screenshots/2021-03-07-141508_1366x768_scrot.png"/></p>
<p align="center"><img src="https://raw.githubusercontent.com/TChanhTinh/dotfiles-that-suckless/main/screenshots/2021-03-07-141716_1366x768_scrot.png"/></p>

# How to install DWM:
[Dwm README](https://github.com/TChanhTinh/dotfiles-that-suckless/blob/main/dwm-6.2/README)

[Dwmblocks README](https://github.com/TChanhTinh/dotfiles-that-suckless/blob/main/dwmblocks/README.md)

# Arch Linux install dependencies:
```
$ yay -S pavucontrol alsa-utils brightnessctl nitrogen slimlock xautolock xclip lxpolkit NetworkManager scrot thunar thunar-archive-plugin thunar-media-tags-plugin thunar-volman ffmpegthumbnailer viewnior w3m w3m-img htop playerctl xsettingsd imagemagick python psmisc rsync wireless_tools dunst rofi python-pywal wpgtk
```

# Ubuntu install dependencies:
```
$ apt install pavucontrol alsa-utils brightnessctl nitrogen xautolock xclip lxpolkit scrot thunar thunar-archive-plugin thunar-media-tags-plugin thunar-volman ffmpegthumbnailer viewnior w3m w3m-img htop playerctl xsettingsd imagemagick python psmisc rsync dunst rofi python3-pip meson build-essential libx11-dev libxinerama-dev sharutils suckless-tools libxft-dev stterm libxext-dev libxcb1-dev libxcb-damage0-dev libxcb-xfixes0-dev libxcb-shape0-dev libxcb-render-util0-dev libxcb-render0-dev libxcb-randr0-dev libxcb-composite0-dev libxcb-image0-dev libxcb-present-dev libxcb-xinerama0-dev libxcb-glx0-dev libpixman-1-dev libdbus-1-dev libconfig-dev libgl1-mesa-dev libpcre2-dev libpcre3-dev libevdev-dev uthash-dev libev-dev libx11-xcb-dev && pip3 install pywal
```

# My Setup: 
* Window Manager: DWM
* Shell: Zsh 
* Terminal: Kitty
* Compositor: Picom
* Notify Daemon: Dunst
* Application Launcher: Rofi
* File Manager: Thunar
* GUI & CLI IDE: Code-OSS, Vim
* Music player: mpv

# DWM patches:
* dwmblock
* fakefullscreen
* barpadding
* awesomebar
* autostart
* activetagindicatorbar
* dwm-statuscmd
* dwm-statuscmd-signal
* dwmblocks-statuscmd
* setsmfact
* alpha
* center
* center-keybind (https://gitea.com/fake_larry/dwm/src/branch/patch/6.2/center)

# Keybind:
| Key | Option  |
| --- |:-------:|
| `MODKEY + T` | Open Terminal |
| `MODKEY + E` | Open Thunar |
| `MODKEY + R` | Open application launcher (Rofi) |
| `MODKEY + 1/2/3/4` | Switch workplace |
| `MODKEY + Shift + 1/2/3/4` | Move window to another workplace |
| `MODKEY + B` | Toggle bar |
| `MODKEY + C` | Close window |
| `MODKEY + Z` | Zoom window |
| `MODKEY + A` | Switch to left window |
| `MODKEY + D` | Switch to right window |
| `MODKEY + G` | Toggle floating window and centered it |
| `MODKEY + Tab` | Switch to right window |
| `MODKEY + Shift + A` | Expand right window |
| `MODKEY + Shift + D` | Expand left window |
| `MODKEY + Shift + S` | Expand top window |
| `MODKEY + Shift + W` | Expand bottom window |
| `MODKEY + Shift + X` | Hide window |
| `MODKEY + Shift + Z` | Show window |
| `MODKEY + K` | Set tiling layout |
| `MODKEY + H` | Switch tiling style left |
| `MODKEY + V` | Switch tiling style right |
| `MODKEY + N` | Set floating layout |
| `MODKEY + M` | Set zen layout |
| `MODKEY + X` | Toggle layout |
| `Print` | Screenshot |
| `Shift + Print` | Area screenshot |
| `MODKEY + Shift + R` | Reload DWM |
| `MODKEY + Shift + Q` | Quit DWM |

Thank owl4ce for base scripts.
Feel free report any issue or new idea on this setup, forks are welcome!
