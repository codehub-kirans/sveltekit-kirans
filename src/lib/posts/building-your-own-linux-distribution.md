---
title: 'Building your own Linux Distribution'
date: '2023-07-30'
updated: '2023-07-30'
categories:
  - 'engineering'
  - 'linux'
coverImage: '/images/optimized/kiran-os.webp'
coverWidth: 16
coverHeight: 9
excerpt: Building a custom linux distribution from scratch is a challenging but rewarding project that will give you a deeper understanding of how Linux works and how to customize it for your needs. Although there are already several hundred active linux distributions out in the wild to try (over 300 active as per distrowatch at the time of this writing itself), building one by yourself helps you learn what makes it tick from the inside.
---

<script>
	import Callout from '$lib/components/Callout.svelte';
</script>

Building a custom linux distribution from scratch is a challenging but rewarding project that will give you a deeper understanding of how Linux works and how to customize it for your needs. Although there are already several hundred active linux distributions out in the wild to try (over 300 active as per distrowatch at the time of this writing itself), building one by yourself helps you learn what makes it tick from the inside.

This post is about my experience building linux from scratch on ARM64 architectures on a Mac using an existing Linux distribution running inside a virtual machine (VM) like VMware Fusion. Then, I will show you how to load the custom Linux distribution within the VM itself. This way, you can experiment with Linux without affecting your Mac’s host OS. The procedure would be the same regardless of the host OS. I rely on the time-tested [Linux from Scratch project](https://www.linuxfromscratch.org/lfs/)(LFS) and although the information on LFS is primarily targeted for x86 architectures, by fixing a few issues along the way you can get it to run on arm archtiectures as well.

To build Linux from scratch in a VM on ARM64 architectures such as on a Mac, you will need the following:

- A Mac with an ARM64 processor, such as the MacBook Air (M1/M2), MacBook Pro (M1/M2), Mac mini (M1,M2), or an iMac (M1, M2).
- VMware Fusion, which is a desktop virtualization software that allows you to run multiple operating systems on your Mac at the same time. The free version is sufficient for our use case.
- [Ubuntu 23.04 live server](https://ubuntu.com/download/server/arm), which is a popular and user-friendly Linux distribution that we will use as the host system for building our custom Linux system.
- [The LFS book](https://www.linuxfromscratch.org/lfs/), which is the official guide for building Linux from scratch. We will use the latest stable version, which is 11.3 at the time of writing this post.

## Building a Linux distribution from scratch

The process of building Linux from scratch consists of two main phases:

- Preparing the host system
- Constructing the target system

### Preparing the host system

The host system is the existing Linux system that we will use to build our custom Linux system. In our case, we will use Ubuntu 23.04 running inside a VM on VMware Fusion. To prepare the host system, we need to do the following:

Create a VM by using VMware Fusion and run the live image of Ubuntu. On booting the live image in the VM, we will be presented with the option to either install or try the OS. Choose try and on the next page, choose Help -> Shell on the top right to enter the console. Alternatively, you can choose to install the OS inside the VM as well. But since this is a temporary system to build your linux distribution, you can just opt to run the OS inside the VM.

Once you're entered the console, install the required packages for building LFS on Ubuntu. You can use the following commands to install them:

```bash
sudo apt update
sudo apt install binutils bison gawk gcc g++ make patch perl python3 texinfo xz-utils
```

Run the following script to ensure you have the requisite packages in your host system for cross-compiling the OS:

```bash
cat > version-check.sh << "EOF"
#!/bin/bash
# Simple script to list version numbers of critical development tools
export LC_ALL=C
bash --version | head -n1 | cut -d" " -f2-4
MYSH=$(readlink -f /bin/sh)
echo "/bin/sh -> $MYSH"
echo $MYSH | grep -q bash || echo "ERROR: /bin/sh does not point to bash"
unset MYSH
echo -n "Binutils: "; ld --version | head -n1 | cut -d" " -f3-
bison --version | head -n1
if [ -h /usr/bin/yacc ]; then
  echo "/usr/bin/yacc -> `readlink -f /usr/bin/yacc`";
elif [ -x /usr/bin/yacc ]; then
  echo yacc is `/usr/bin/yacc --version | head -n1`
else
  echo "yacc not found"
fi
echo -n "Coreutils: "; chown --version | head -n1 | cut -d")" -f2
diff --version | head -n1
find --version | head -n1
gawk --version | head -n1
if [ -h /usr/bin/awk ]; then
  echo "/usr/bin/awk -> `readlink -f /usr/bin/awk`";
elif [ -x /usr/bin/awk ]; then
  echo awk is `/usr/bin/awk --version | head -n1`
else
  echo "awk not found"
fi

gcc --version | head -n1
g++ --version | head -n1
grep --version | head -n1
gzip --version | head -n1
cat /proc/version
m4 --version | head -n1
make --version | head -n1
patch --version | head -n1
echo Perl `perl -V:version`
python3 --version
sed --version | head -n1
tar --version | head -n1
makeinfo --version | head -n1  # texinfo version
xz --version | head -n1
echo 'int main(){}' > dummy.c && g++ -o dummy dummy.c
if [ -x dummy ]
  then echo "g++ compilation OK";
else echo "g++ compilation failed"; fi rm -f dummy.c dummy
EOF
bash version-check.sh
```

If you see anything missing, use aptitude to install a remaining missing packages.

Create a 15GB root (/) linux file system partition and a 100MB EFI boot partition You can use any partitioning tool that you prefer, such as fdisk, cfdisk, or gparted. The size of the root partition depends on how much software you want to install on your LFS system, but it should be at least 10 GB. For simplicity, we will assume that the disk is an nvme drive and the partition is /dev/nvme0n1p1 for the efi boot partition and dev/nvme0n1p2 for the root (/) partition in this post. Some (old) UEFI implementations may require the ESP to be the first partition on the disk.

Create filesystems on the EFI and root partitions. You can use any filesystem type that you prefer, such as ext4, xfs, or btrfs for the root partition, but it should be vfat for the EFI partition. For simplicity, we will assume that the filesystem type is ext4 for the root partition in this post. You can use the following commands for the same:

```bash
# Format the efi partition as vfat
mkfs.vfat /dev/nvme0n1p1

# Format the root partition as ext4
mkfs.ext4 /dev/nvme0n1p2
```

Set the **$LFS** Variable - ensure that this variable is always defined throughout the LFS build process. It should be set to the name of the directory where you will be building your LFS system - we will use /mnt/lfs

```bash
export LFS=/mnt/lfs
```

Mount the root partition on a mount point. You can use any mount point that you prefer, such as /mnt/lfs or /lfs. For simplicity, we will assume that the mount point is /mnt/lfs in this post. You can use the following commands for the same:

```bash
sudo mkdir -pv $LFS
sudo mount -v -t ext4 /dev/nvme0n1p2 $LFS
```

Download the LFS book and the LFS sources. You can use the following commands to download them:

```bash
wget https://www.linuxfromscratch.org/lfs/downloads/stable/LFS-BOOK-11.3.pdf
wget https://www.linuxfromscratch.org/lfs/downloads/stable/wget-list
wget https://www.linuxfromscratch.org/lfs/downloads/stable/md5sums
mkdir -v /mnt/lfs/sources
chmod -v a+wt /mnt/lfs/sources
wget --input-file=wget-list --continue --directory-prefix=/mnt/lfs/sources
pushd /mnt/lfs/sources
md5sum -c md5sums
popd
```

Create a user for building LFS. You can use any username that you prefer. For simplicity, assume that the username is lfs in this post. You can use the following commands to create the user and set up its environment:

```bash
sudo groupadd lfs
sudo useradd -s /bin/bash -g lfs -m -k /dev/null lfs
sudo passwd lfs
sudo chown -v lfs $LFS/sources
sudo chown -v lfs $LFS/tools
su - lfs
cat > ~/.bash_profile << "EOF"
# Personal aliases and functions should go in ~/.bashrc.  System wide
# environment variables and startup programs are in /etc/profile.
# System wide aliases and functions are in /etc/bashrc.

if [ -f "$HOME/.bashrc" ] ; then
  source $HOME/.bashrc
fi

if [ -d "$HOME/bin" ] ; then
  pathprepend $HOME/bin
fi
EOF

cat > ~/.bashrc << "EOF"
set +h
umask 022
LFS=/mnt/lfs
LC_ALL=POSIX
LFS_TGT=$(uname -m)-lfs-linux-gnu
PATH=/usr/bin:/bin:/usr/sbin:/sbin:/tools/bin:/usr/local/bin:$PATH
export LFS LC_ALL LFS_TGT PATH MAKEFLAGS='j8'
EOF

source ~/.bash_profile
```

Create a limited directory layout in the LFS filesystem: 

```bash
mkdir -pv $LFS/{etc,var} $LFS/usr/{bin,lib,sbin}
for i in bin lib sbin; do
  ln -sv usr/$i $LFS/$i
done
case $(uname -m) in
  x86_64) mkdir -pv $LFS/lib64 ;;
esac

#cross-compiler will be installed in a special directory, to separate it from the other programs
mkdir -pv $LFS/tools

#Grant lfs full access to all the directories under $LFS by making lfs the owner:
chown -v lfs $LFS/{usr{,/*},lib,var,etc,bin,sbin,tools}
case $(uname -m) in
  x86_64) chown -v lfs $LFS/lib64 ;;
esac
```

At this point, we have the host system for building LFS. We can now proceed to the next phase.

### Constructing the target system

The target system is the custom Linux system that we will build from scratch. In this phase, we will follow the instructions in the LFS book to compile and install the essential components of a Linux system on the LFS partition. This phase consists of several chapters, each covering a different aspect of the target system, such as:

**Chapter 5: Constructing a Temporary System**, which builds a temporary cross-compiler toolchain that will be used to compile the basic utilities for building the final system.

**Chapter 6: Cross-compiling and installing Basic Minimal System utilities** using the host OS's tools, which installs the foundational packages and libraries to bootstrap the system

**Chapter 7: Entering a chroot jail** to cross compile the remaining temporary tools for us to natively build the various Linux packages.

**Chapter 8: Compiling and installing Basic System Software**, which installs the core packages and libraries that make up a basic Linux system.

**Chapter 9: System Configuration**, which configures the system settings, such as network, hostname, timezone, etc.

I will not repeat the instructions in the LFS book here, as they are very detailed and clear. However, I will provide some tips and notes for building LFS on ARM64 architectures on a Mac using VMware outcomes.

When compiling packages, you may encounter some errors or warnings related to ARM64-specific features or issues. You can usually fix them by applying patches or modifying configuration files. You will likely encounter the following compilation issues:

- gcc-libstdc++: move /usr/lib64 contents to /usr/lib and delete the /usr/lib64 directory
- expect: modify the configure script as follows:

./configure --prefix=/usr           \
            --with-tcl=/usr/lib     \
            --enable-shared         \
            --mandir=/usr/share/man \
            --with-tclinclude=/usr/include \
            --build=aarch64-unknown-linux-gnu

 - python-3.11.4: copy /usr/lib64/libffi.so.8 to /usr/lib/ so ctypes module can be compiled. Also copy /usr/lib64/libffi.so.8  to /usr/lib/    
 - procps-ng: export PKG_CONFIG_PATH path  in 875-procps-ng file before configure.
 
 export PKG_CONFIG_PATH="/usr/lib64/pkgconfig"

When configuring the kernel, you may need to enable some options that are specific to ARM64 architectures or your target device. You can use the make menuconfig command to select the options you want, such as architecture, CPU type, drivers, filesystems, etc. You can find some useful resources for configuring the kernel on ARM64 [here](https://clfs.org/~kb0iic/lfs-systemd/index.html).

## Booting your custom linux distribution

Building the linux kernel for the first time is one of the most challenging tasks in LFS. Getting it right depends on the specific hardware for the target system and your specific needs. There are almost 12,000 configuration items that are available for the kernel although only about a third of them are needed for most computers.

Prepare for compilation by running the following command:

```bash
# This ensures that the kernel tree is absolutely clean. The kernel team recommends that this command be issued prior to each kernel compilation
make mrproper

# A good starting place for setting up the kernel configuration is to run make defconfig. This will set the base configuration to a good state that takes your current system architecture into account.
make defconfig

# This launches an ncurses menu-driven interface
make menuconfig
```

Be sure to enable/disable/set the following features or the system might not work correctly or boot at all:

```
Processor type and features --->
   [*] Build a relocatable kernel [CONFIG_RELOCATABLE]
   [*]   Randomize the address of the kernel image (KASLR) [CONFIG_RANDOMIZE_BASE]
   [*] EFI runtime service support                               [CONFIG_EFI
General setup --->
   [ ] Compile the kernel with warnings as errors [CONFIG_WERROR]
   [ ] Auditing Support [CONFIG_AUDIT]
   CPU/Task time and stats accounting --->
      [*] Pressure stall information tracking [CONFIG_PSI]
      [ ]   Require boot parameter to enable pressure stall information tracking [CONFIG_PSI_DEFAULT_DISABLED]
   < > Enable kernel headers through /sys/kernel/kheaders.tar.xz [CONFIG_IKHEADERS]
   [*] Control Group support [CONFIG_CGROUPS]   --->
      [*] Memory controller [CONFIG_MEMCG]
   [ ] Configure standard kernel features (expert users) [CONFIG_EXPERT]
General architecture-dependent options  --->
   [*] Enable seccomp to safely compute untrusted bytecode [CONFIG_SECCOMP]
   [*] Stack Protector buffer overflow detection [CONFIG_STACKPROTECTOR]
   [*]   Strong Stack Protector [CONFIG_STACKPROTECTOR_STRONG]
[*] Networking support  --->   [CONFIG_NET]
   Networking options  --->
      [*] TCP/IP networking [CONFIG_INET]
      <*>   The IPv6 protocol [CONFIG_IPV6]
Device Drivers  --->
   Generic Driver Options  --->
      [ ] Support for uevent helper [CONFIG_UEVENT_HELPER]
      [*] Maintain a devtmpfs filesystem to mount at /dev [CONFIG_DEVTMPFS]
      [*]   Automount devtmpfs at /dev, after the kernel mounted the rootfs [CONFIG_DEVTMPFS_MOUNT]
      Firmware Loader --->
         [ ] Enable the firmware sysfs fallback mechanism [CONFIG_FW_LOADER_USER_HELPER]
   Firmware Drivers   --->
      [*] Export DMI identification via sysfs to userspace [CONFIG_DMIID]
      [*] Mark VGA/VBE/EFI FB as generic system framebuffer       [CONFIG_SYSFB_SIMPLEFB]
   Graphics support --->
      Frame buffer Devices --->
         <*> Support for frame buffer devices --->
      Console display driver support --->
         [*] Framebuffer Console support [CONFIG_FRAMEBUFFER_CONSOLE]
      <*> Direct Rendering Manager                                [CONFIG_DRM]
      [*] Enable legacy fbdev support for your modesetting driver [CONFIG_DRM_FBDEV_EMULATION]
      <*> Simple framebuffer driver                               [CONFIG_DRM_SIMPLEDRM]
      Frame buffer Devices --->
        <*> Support for frame buffer devices --->                 [CONFIG_FB]
      Console display driver support --->
        -*- Framebuffer Console support                           [CONFIG_FRAMEBUFFER_CONSOLE]
    Device Drivers --->
      NVME Support --->
       <*> NVM Express block device [CONFIG_BLK_DEV_NVME]
File systems  --->
   [*] Inotify support for userspace [CONFIG_INOTIFY_USER]
       Pseudo filesystems  --->
        [*] Tmpfs POSIX Access Control Lists [CONFIG_TMPFS_POSIX_ACL]
    DOS/FAT/EXFAT/NT Filesystems --->
      <*/M> VFAT (Windows-95) fs support                          [CONFIG_VFAT_FS]
    Pseudo filesystems --->
      <*/M> EFI Variable filesystem                               [CONFIG_EFIVAR_FS]
    -*- Native language support --->                              [CONFIG_NLS]
      <*/M> Codepage 437 (United States, Canada)                  [CONFIG_NLS_CODEPAGE_437]
      <*/M> NLS ISO 8859-1  (Latin 1; Western European Languages) [CONFIG_NLS_ISO8859_1]
Enable the block layer --->
  Partition Types --->
    [*/ ] Advanced partition selection                          [CONFIG_PARTITION_ADVANCED]
    [*]   EFI GUID Partition support                            [CONFIG_EFI_PARTITION]

```

Compile the kernel image and modules and install:

```bash
make
make modules_install
```

Copy the kernel image to the boot directory

```bash
cp -iv arch/arm64/boot/bzImage /boot/vmlinuz-6.4.3-lfs-r11.3-140-systemd
cp -iv System.map /boot/System.map-6.4.3
cp -iv .config /boot/config-6.4.3

# Install the documentation for the Linux kernel:
install -d /usr/share/doc/linux-6.4.3
cp -r Documentation/* /usr/share/doc/linux-6.4.3
```

On EFI based systems, the bootloaders are installed in a special FAT32 partition called an EFI System Partition (ESP). Confirm the partition type with the following command:

```bash
fdisk -l /dev/nvme0n1p1
```

The “Type” column of the ESP should be EFI System.

Create the mount point for the ESP, and mount it (replace /dev/nvme0n1p1 with the device node corresponding to the ESP):

```bash
mkdir -pv /boot/efi &&
mount -v -t vfat /dev/nvme0n1p1 /boot/efi
```

Install the arm64 EFI utilities on the host with the following command:

```bash
apt install grub-efi-arm64
```

Now install grub with the following command

```bash
grub-install --target=arm64-efi --boot-directory=/mnt/lfs/boot bootloader-id=LFS --efi-directory=/boot/efi
```

Configure the grub file in /mnt/lfs/boot/grub.cfg

```bash
# Begin /boot/grub/grub.cfg
set default=0
set timeout=5

insmod part_gpt
insmod ext2
#set root=(hd0,2)

if loadfont /boot/grub/fonts/unicode.pf2; then
  set gfxmode=auto
  insmod all_video
  terminal_output gfxterm
fi

menuentry "Custom Linux, r11.3-169-systemd-6.4.3"  {
  linux   /boot/vmlinuz-6.4.3-lfs-11.3-systemd root=/dev/nvme0n1p2 ro
}

menuentry "Firmware Setup" {
  fwsetup
}
```

## Making the distribution uniquely your own

Congratulations! The new LFS system is now installed!

It may be a good idea to now create the customary /etc/lfs-release file. By having this file, it is very easy for you to find out which LFS version is installed on the system. Create this file by running:

```bash
cat > /etc/lsb-release << "EOF"
DISTRIB_ID="My Linux"
DISTRIB_RELEASE="11.3-systemd"
DISTRIB_CODENAME="<your name here>"
DISTRIB_DESCRIPTION="Linux From Scratch"
EOF
```

The second one contains roughly the same information, and is used by systemd

```bash
cat > /etc/os-release << "EOF"
NAME="My Linux"
VERSION="11.3-systemd"
ID=lfs
PRETTY_NAME="Linux From Scratch 11.3-systemd"
VERSION_CODENAME="<your name here>"
EOF
```

Now that all of the software has been installed and configured, all that is left now is to reboot your VM and login into your shiny new custom built Linux distribution!
