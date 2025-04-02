# Rename avatar files
$files = @(
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98255.jpeg"; newName = "avatar_1.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98256.jpeg"; newName = "avatar_2.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98257.jpeg"; newName = "avatar_3.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98258.jpeg"; newName = "avatar_4.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98259.jpeg"; newName = "avatar_5.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98260.jpeg"; newName = "avatar_6.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98261.jpeg"; newName = "avatar_7.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98262.jpeg"; newName = "avatar_8.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98263.jpeg"; newName = "avatar_9.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98264.jpeg"; newName = "avatar_10.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98265.jpeg"; newName = "avatar_11.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98266.jpeg"; newName = "avatar_12.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98267.jpeg"; newName = "avatar_13.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98268.jpeg"; newName = "avatar_14.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98269.jpeg"; newName = "avatar_15.jpeg"},
    @{oldName = "freepik__the-style-is-candid-image-photography-with-natural__98270.jpeg"; newName = "avatar_16.jpeg"},
    @{oldName = "magicstudio-art (1).jpg"; newName = "avatar_17.jpg"},
    @{oldName = "magicstudio-art.jpg"; newName = "avatar_18.jpg"},
    @{oldName = "28dce2189e892da28c6aa149f19dc1a60d9a3450.jpg"; newName = "avatar_19.jpg"},
    @{oldName = "craiyon_065947_anime_boy_with_pink_and_blue_hair.png"; newName = "avatar_20.png"},
    @{oldName = "ea6b161f-4985-440c-af31-ef4c0cb0214f.jpeg"; newName = "avatar_21.jpeg"},
    @{oldName = "aba4a3bc-5ffd-4cae-aa7f-2b8b43e857ab.jpeg"; newName = "avatar_22.jpeg"},
    @{oldName = "1ee776d6-1474-481e-9e79-bcd77ffdb67a.jpeg"; newName = "avatar_23.jpeg"},
    @{oldName = "7bf976c3-c56c-4e2e-9d00-8f0b6945f434.jpeg"; newName = "avatar_24.jpeg"},
    @{oldName = "465297cc-2474-4e35-885f-62f381bdd14f.jpeg"; newName = "avatar_25.jpeg"},
    @{oldName = "a9534eba-67d4-4a6a-ac06-bbf40e0ba598.jpeg"; newName = "avatar_26.jpeg"},
    @{oldName = "f8f2c1ef-d1b9-4889-b408-64491b0e2c34.png"; newName = "avatar_27.png"},
    @{oldName = "7a1d1e66-7474-4b2b-9fe1-a579519dec1f.jpeg"; newName = "avatar_28.jpeg"}
)

# Change directory to the avatars folder
Set-Location -Path "C:\Life\NewApp\TrackYouStudy\src\avtars"

# Rename each file
foreach ($file in $files) {
    if (Test-Path $file.oldName) {
        Write-Host "Renaming $($file.oldName) to $($file.newName)"
        Rename-Item -Path $file.oldName -NewName $file.newName -Force
    } else {
        Write-Host "File not found: $($file.oldName)"
    }
}

Write-Host "All avatars have been renamed successfully." 