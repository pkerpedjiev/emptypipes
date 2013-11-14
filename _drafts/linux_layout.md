---
layout: post
title:  "My Linux and Xfce Customizations"
categories: linux xfce
---

##### Xfce Keyboard Shortcuts #####

Both at home and at work I use some distribution of linux with Xfce as the window manager. Over the years, I've added various shortcuts to speed up the things I do often. The most important of them are the keyboard shortcuts for launching applications. These are set by going to `Settings` -> `Keyboard` and then opening the `Application Shortcuts` tab. In there, my three most used programs are assigned the following shortcuts:

| Command               | Shortcut               |
|:--------------------- | ----------------------:|
| `gnome_terminal`      | `<Alt> F1`             |
| `chromium-browser`    | `<Alt> F3`             |
| `thunar`              | `<Alt> F5`             |

###### Speaker Volume ######

My speakers are further away than my keyboard. Changing the volume using the knob requires me to lean forward. Too much work. Moving the mouse is also annoying. Thankfully, I can add the following keybindings in XFCE and control the volume from my keyboard and subsequently raise the volume using <Ctrl><Alt> + and lower the volume using <Ctrl><Alt> - . Pretty convenient!
Command


| Command                         | Shortcut                            |
|:------------------------------- | -----------------------------------:|
| `amixer set Master 4%- -q`      | `<Primary> <Alt> minus`             |
| `amixer set Master 4%+ -q`      | `<Primary> <Alt> minus`             |


##### BASH forward command search ######

Instead of hitting the up-arrow to repeat a command I've entered previously, I commonly hit <Ctrl> R to search for a particular command. This is generally really efficient except when I'm searching for something far back in time by repeatedly hitting <Ctrl> R and I end up missing the command I was looking for. Woe is me if there were a lot of commands between my target and the one I'm currently on. Ideally, I would like to just hit <Ctrl> S and go the next occurance of my search string in my history file. Alas, <Ctrl> S is already bound and needs to be freed before we can use it this way. To do this, I added the following line to my `.bashrc` file:

    stty stop ^X

Now when I search for a previous command using <Ctrl> R, I can reverse the search (and search forward) in the command history list.

##### BASH Aliases #####

There's some command-option combinations that I run so often that I've assigned them aliases in my `.bashrc` file. This allows me to substitue a short command for a longer one. Listed below are my most used aliases in order of their importance.

1. List the files in the directory in reverse-time sorted order. 

`alias lt='ls -lhtr'`

This is my most used command, period. I'm almost always interested in my recently accessed files. This command provides those at the bottom, along with all the information about them.

2. Shortcut for logging into my work computer:

`alias work-login=`ssh user@workcomputer.com`

My username and computer name don't change very often at work. Why re-type them every time?

3. Create and attach to tmux windows:

```
alias tattach='tmux attach -t'
alias tnew='tmux new -s'
```

I'm a big fan of the screen multiplexer tmux. These aliases allow me to quickly create new sessions and attach to old ones.

4. Get the size of a folder and all its subfolders:

`alias dum='du --max-depth=1 -h'`

Comes in handy for finding out which directories are the biggest from the command line.

5. Get summary statistics for a list of numbers:

`alias fivestats="awk '{if(min=="'""'"){min=max=\$1}; if(\$1>max) {max=\$1}; if(\$1<min) {min=\$1}; total+=\$1; count+=1} END {print total/count, max, min, count}'`

I often want to compare two sets of numbers. This command allows me to get the mean, max, min, and count of the list without creating an awk script every time.

