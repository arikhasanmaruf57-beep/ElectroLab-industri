set -e
cd /home/claude/out && rm -f /mnt/user-data/outputs/electrolab-component-assets.zip && zip -qr /mnt/user-data/outputs/electrolab-component-assets.zip public
cd /home/claude && rm -f /mnt/user-data/outputs/electrolab-asset-generator.zip && zip -qr /mnt/user-data/outputs/electrolab-asset-generator.zip gen -x "gen/node_modules/*"
ls -la /mnt/user-data/outputs/*.zip
