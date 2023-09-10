---
title: 'NixOS: Reproducible Linux Distributions through Functional Package Management'
date: '2023-09-10'
updated: '2023-09-10'
categories:
  - 'engineering'
  - 'linux'
  - 'nixOS'
coverImage: '/images/optimized/nixos-login.webp'
coverWidth: 16
coverHeight: 9
excerpt: Have you ever wondered what it would be like to quickly build and deploy your own Linux system from scratch? To have complete control over every aspect of your operating system, from the kernel to the desktop environment? To be able to customize, configure, and update your system with ease and reliability? If you answered yes to any of these questions, then you might be interested in NixOS, a Linux distribution that offers a unique and powerful way of managing your system with Nix, a functional package manager.
---

<script>
	import Callout from '$lib/components/Callout.svelte';
  import ImageLoader from '$lib/components/ImageLoader.svelte';
</script>

NixOS is not your typical Linux distribution. It is a radical departure from the traditional way of managing your system, where you install packages, edit configuration files, and hope that everything works as expected. Instead, NixOS is based on Nix, a functional package manager that allows you to declaratively specify your system configuration in a single file, and then automatically build and deploy it with atomicity and reproducibility. This means that you can easily roll back to previous states, share your configuration with others, and run multiple versions of the same software without conflicts.

## What is Nix and how does it work?

Nix is a functional package manager that aims to provide a reliable and reproducible way of managing software dependencies and configurations. Unlike traditional package managers, Nix does not install packages into a global system directory, such as /usr or /bin, but rather into isolated store paths that are identified by cryptographic hashes. These store paths are immutable and can be shared across different machines or users. Nix also keeps track of the dependencies of each package, and ensures that only the required packages are installed and available.

Nix works by evaluating Nix expressions, which are files written in a pure and lazy functional language that describe how to build packages and configurations. Nix expressions can specify various attributes of a package, such as its name, version, source code, patches, dependencies, build commands, environment variables, etc. Nix expressions can also use functions, variables, conditionals, and other constructs to create complex and modular definitions.

When Nix evaluates a Nix expression, it first computes its hash based on its content and dependencies. This hash is used to name the store path where the package will be installed. For example, a store path for the hello package might look like this:

```bash
/nix/store/b6gvzjyb2pg0kjfwrjmg1vfhh54ad73z-hello-2.10
```

Nix then checks if the store path already exists in the local or remote cache. If it does, it means that the package has already been built and can be used directly. If it does not, it means that the package needs to be built from scratch. Nix then downloads or builds the dependencies of the package, and then builds the package itself using a sandboxed environment that only contains the specified inputs and outputs. Nix then copies the resulting files to the store path and registers them in a local database.

Nix also allows users to create multiple profiles that point to different sets of packages in the store. A profile is simply a symlink to a store path that contains a manifest file that lists the packages in the profile. Users can switch between profiles atomically and roll back to previous versions if needed. Nix also supports garbage collection, which removes unused packages from the store to free up disk space.

## Installing NixOS on your machine or in a virtual environment

- Download the NixOS ISO image from the official website. You can choose between GNOME and KDE desktop environments, or a minimal image if you prefer. For this post, I will use the minimal image and use the console installer.

- Create a VM by using VMware Fusion and run the NixOS minimal image. On booting the live image in the VM, we will be presented with the option to install the OS which takes you to the console. You are logged-in automatically as nixos. The nixos user account has an empty password so you can use sudo without a password. After you have ensured that the system has an internet connection, NixOS can now be installed.
- The NixOS installer doesn’t do any partitioning or formatting, so you need to do that yourself. Use the lsblk command to identify the drive to install and then run a disk partitioning tool like cfdisk to setup your partitions.

```bash
lsblk
sudo cfdisk /dev/nvme0n1
```

1. Select gpt as the label type and press Enter.
2. Select New and press Enter. Enter 1G as the size and press Enter. This will create a 1 GB partition for EFI.
3. Select Type and press Enter. Enter ef00 as the type code and press Enter. This will set the partition type to EFI System.
4. Select New and press Enter. Leave the size as default and press Enter. This will create a partition for LVM with the remaining space.
5. Select Type and press Enter. Enter 8e00 as the type code and press Enter. This will set the partition type to Linux LVM.
6. Select Write and press Enter. Type yes and press Enter to confirm. This will write the changes to the disk.
7. Select Quit and press Enter to exit cfdisk2.

<ImageLoader src="/images/optimized/nixos-partitioning.webp" alt="Nixos Partitioning" caption="Nixos Partitioning" --scaling="100%">
</ImageLoader>

- Run sudo cryptsetup luksFormat /dev/nvme0n1p2 to encrypt the LVM partition with LUKS. Type YES in uppercase and press Enter to confirm. Enter a passphrase of your choice and press Enter. Repeat the passphrase and press Enter. Next run sudo cryptsetup luksOpen /dev/nvme0n1p2 enc-pv to unlock the encrypted partition. Enter the passphrase you set in the previous step and press Enter.

```bash
sudo cryptsetup luksFormat /dev/nvme0n1p2
sudo cryptsetup luksOpen /dev/nvme0n1p2 enc-pv
```

- Create the lvm physical volume on the unlocked partition and the volume group on the physical volume. On the volume group, create the logical volumes for the root and swap volumes. In this post, I create a 20G volume for the root and 4GB volume for swap.

```bash
sudo pvcreate /dev/mapper/enc-pv
sudo vgcreate vg /dev/mapper/enc-pv
sudo lvcreate -L 20G -n root vg
sudo lvcreate -l '100%FREE' -n swap vg
```

- Now format and mount the volumes.

```bash
sudo mkfs.fat -F 32 -n boot /dev/nvme0n1p1
sudo mkfs.ext4 -L nixos /dev/vg/root
sudo mkswap -L swap /dev/vg/swap
sudo mount /dev/disk/by-label/nixos /mnt
sudo mkdir -p /mnt/boot
sudo mount /dev/disk/by-label/boot /mnt/boot
sudo swapon /dev/vg/swap
```

- Run lsblk to verify you have something similar to below

<ImageLoader src="/images/optimized/nixos-lsblk.webp" alt="Partition List" caption="Partition List" >
</ImageLoader>

- Generate the configuration.nix that specifies the intended configuration of the system. This is because NixOS has a declarative configuration model: you create or edit a description of the desired configuration of your system, and then NixOS takes care of making it happen.

```bash
sudo nixos-generate-config --root /mnt
sudo vi /mnt/etc/nixos/configuration.nix
```

- Use the following file as a template for your configuration.nix file. Update timezone and user account name as per your requirement.

```bash
# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running `nixos-help`).

{ config, pkgs, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Use the systemd-boot EFI boot loader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  # networking.hostName = "nixos"; # Define your hostname.
  # Pick only one of the below networking options.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.
  # networking.networkmanager.enable = true;  # Easiest to use and most distros use this by default.

  # Set your time zone.
  time.timeZone = "Asia/Kolkata";

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  # i18n.defaultLocale = "en_US.UTF-8";
  # console = {
  #   font = "Lat2-Terminus16";
  #   keyMap = "us";
  #   useXkbConfig = true; # use xkbOptions in tty.
  # };

  # Enable the X11 windowing system.
  # services.xserver.enable = true;




  # Configure keymap in X11
  # services.xserver.layout = "us";
  # services.xserver.xkbOptions = "eurosign:e,caps:escape";

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # sound.enable = true;
  # hardware.pulseaudio.enable = true;

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.kirans = {
    isNormalUser = true;
    extraGroups = [ "wheel" ]; # Enable ‘sudo’ for the user.
    packages = with pkgs; [
      firefox
    ];
  };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    wget
    tree
    git
    starship
    gcc
    neofetch
  ];
  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  services.openssh.enable = true;

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # Copy the NixOS configuration file and link it from the resulting system
  # (/run/current-system/configuration.nix). This is useful in case you
  # accidentally delete configuration.nix.
  # system.copySystemConfiguration = true;

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It's perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "23.05"; # Did you read the comment?

  # enable LUKS encryption
  boot.initrd.luks.devices = {
    root = {
      device = "/dev/disk/by-uuid/<your-lvm_partition-uuid>"; # change this to the UUID of LVM partition, you can use `sudo blkid` to find it
      preLVM = true;
      allowDiscards = true;
    };
  };

}
```

- Create a nix program configuration file for your program configurations

```bash
# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running `nixos-help`).

{ config, pkgs, ... }:

{

 programs.starship = {
   enable = true;
   settings = {
   };
 };

 programs.bash.interactiveShellInit = ''
   neofetch --ascii_distro nixos
 '';

}

```

- Start the installation by running the **nixos-install** command and reboot when done. Enter a password for the root account when prompted. If anything fails due to a configuration problem or any other issue (such as a network outage while downloading binaries from the NixOS binary cache), you can re-run nixos-install after fixing your configuration.nix.

```bash
sudo nixos-install
sudo reboot now
```

- Login as root and create a password for your user account which was kirans in my case.

```bash
passwd kirans
```

That's it! Enjoy your NixOS installation with encryption and LVM on an NVMe drive!

## Using nix commands to manage your packages

Your configuration.nix file is the main file that defines your NixOS system configuration. It is a Nix expression that specifies various options for your system, such as the boot loader, the network settings, the user accounts, the services, and the packages. You can write and edit your configuration.nix file using any text editor of your choice, such as vim, nano, or VSCode.

To write and edit your configuration.nix file, you need to follow some basic steps:

- Locate your configuration.nix file. By default, it is located at /etc/nixos/configuration.nix. You can also use a different location by passing the --option switch to nixos-rebuild2.
- Open your configuration.nix file with a text editor. For example, you can run sudo vim /etc/nixos/configuration.nix to edit it with vim. You need root privileges to edit this file.
- Modify the options in your configuration.nix file according to your needs and preferences. You can use the NixOS manual and the NixOS options search to find out the available options and their descriptions. You can also use modules, overlays, flakes, and channels to extend and modify your configuration5678.
- Save and close your configuration.nix file. You can use :wq in vim or Ctrl+O and Ctrl+X in nano to save and exit.
  Rebuild and activate your system configuration by running sudo nixos-rebuild switch. This will apply the changes you made in your configuration.nix file and make them effective immediately.

To install and activate the new configuration:

1. Do a **sudo nixos-rebuild build** so that you’re sure that the build of your current configuration can be carried out
2. Do a garbage collection to remove old system generations with **sudo nix-collect-garbage -d**
3. Manually make some space in boot. Find your kernels and rm them.
4. Run **sudo nixos-rebuild switch** followed by **sudo nixos-rebuild boot**. This time your bootloader will be installed correctly along with the new kernel and initrd
5. Make sure point 4 was executed correctly by looking at the output and reboot. Optionally remove the result directory created by point 1

```bash
sudo nixos-rebuild build
sudo nix-collect-garbage -d
sudo nixos-rebuild switch
sudo nixos-rebuild boot
```
