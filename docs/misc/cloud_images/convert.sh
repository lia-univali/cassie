idx=1
for i in thumb*; do
    name=$(printf "%03d.png" "$idx")
    mv "$i" "$name"
    echo "$i,$name" >> map.txt
    let idx=idx+1
done

