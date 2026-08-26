$products = @(
    @{
        name = "หูฟัง Sony WH-1000XM5"
        price = 12990
        description = "หูฟัง Noise Cancelling ระดับพรีเมียม เสียงคมชัด ใส่สบาย แบตเตอรี่นาน 30 ชั่วโมง"
        imageUrl = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600"
        stock = 25
    },
    @{
        name = "Apple AirPods Pro (Gen 2)"
        price = 9490
        description = "หูฟัง True Wireless พร้อม Active Noise Cancellation และ Transparency Mode"
        imageUrl = "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600"
        stock = 40
    },
    @{
        name = "Mechanical Keyboard Keychron K2"
        price = 3590
        description = "คีย์บอร์ด Mechanical แบบ 75% Wireless Bluetooth รองรับ Mac/Windows"
        imageUrl = "https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=600"
        stock = 15
    },
    @{
        name = "Logitech MX Master 3S"
        price = 4290
        description = "เมาส์ Wireless ประสิทธิภาพสูง เซนเซอร์ 8000 DPI เงียบกว่า 90%"
        imageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600"
        stock = 30
    },
    @{
        name = "iPad Air (M2) 11 นิ้ว"
        price = 22900
        description = "แท็บเล็ตพลัง M2 จอ Liquid Retina 11 นิ้ว รองรับ Apple Pencil Pro"
        imageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"
        stock = 10
    },
    @{
        name = "Samsung 27 4K Monitor"
        price = 14500
        description = "จอมอนิเตอร์ 4K UHD 27 นิ้ว IPS Panel สำหรับงานสร้างสรรค์และเกมมิ่ง"
        imageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"
        stock = 8
    }
)

Write-Host "Starting product seed..." -ForegroundColor Yellow

$count = 0
for ($i = 0; $i -lt $products.Length; $i++) {
    $product = $products[$i]
    $body = $product | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method POST -Body $body -ContentType "application/json"
        Write-Host "Added: $($product.name)" -ForegroundColor Green
        $count++
    } catch {
        Write-Host "Error: $($product.name) - $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! Inserted $count products." -ForegroundColor Cyan
