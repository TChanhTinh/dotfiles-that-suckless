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
| `Super + T` | Open Terminal |
| `Super + E` | Open Thunar |
| `Super + R` | Open application launcher (Rofi) |
| `Super + 1/2/3/4` | Switch workplace |
| `Super + Shift + 1/2/3/4` | Move window to another workplace |
| `Super + B` | Toggle bar |
| `Super + C` | Close window |
| `Super + Z` | Zoom window |
| `Super + A` | Switch to left window |
| `Super + D` | Switch to right window |
| `Super + G` | Toggle floating window and centered it |
| `Super + Tab` | Switch to right window |
| `Super + Shift + A` | Expand right window |
| `Super + Shift + D` | Expand left window |
| `Super + Shift + S` | Expand top window |
| `Super + Shift + W` | Expand bottom window |
| `Super + Shift + X` | Hide window |
| `Super + Shift + Z` | Show window |
| `Super + K` | Set tiling layout |
| `Super + H` | Switch tiling style left |
| `Super + V` | Switch tiling style right |
| `Super + N` | Set floating layout |
| `Super + M` | Set zen layout |
| `Super + X` | Toggle layout |
| `Print` | Screenshot |
| `Shift + Print` | Area screenshot |
| `Super + Shift + R` | Reload DWM |
| `Super + Shift + Q` | Quit DWM |

Thank owl4ce for base scripts.
Feel free report any issue or new idea on this setup, forks are welcome!
