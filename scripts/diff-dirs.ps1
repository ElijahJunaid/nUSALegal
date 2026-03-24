# diff-dirs.ps1
# Compares C:\Users\reale\Downloads\new-usa against the current project directory.
# Reports files that are Added, Deleted, or Modified.

param(
    [string]$Baseline = "C:\Users\reale\Documents\nUSALegal",
    [string]$Incoming = "C:\Users\reale\Downloads\new-usa",
    [string[]]$Exclude  = @('.git', 'node_modules', '.nuxt', 'dist')
)

function Get-FileMap {
    param([string]$Root, [string[]]$ExcludeDirs)

    $map = @{}

    Get-ChildItem -Path $Root -Recurse -File | ForEach-Object {
        $relativePath = $_.FullName.Substring($Root.Length).TrimStart('\', '/')

        # Skip if any excluded dir segment appears in the relative path
        $skip = $false
        foreach ($ex in $ExcludeDirs) {
            if ($relativePath -like "$ex\*" -or $relativePath -like "$ex/*" -or $relativePath -eq $ex) {
                $skip = $true
                break
            }
        }
        if ($skip) { return }

        $hash = (Get-FileHash -Path $_.FullName -Algorithm SHA256).Hash
        $map[$relativePath] = $hash
    }

    return $map
}

Write-Host ""
Write-Host "Baseline : $Baseline" -ForegroundColor Cyan
Write-Host "Incoming : $Incoming" -ForegroundColor Cyan
Write-Host "Excluding: $($Exclude -join ', ')" -ForegroundColor Cyan
Write-Host ""
Write-Host "Computing file hashes..." -ForegroundColor DarkGray

$baseMap = Get-FileMap -Root $Baseline -ExcludeDirs $Exclude
$newMap  = Get-FileMap -Root $Incoming  -ExcludeDirs $Exclude

$added    = [System.Collections.Generic.List[string]]::new()
$deleted  = [System.Collections.Generic.List[string]]::new()
$modified = [System.Collections.Generic.List[string]]::new()

# Files in incoming not in baseline => Added
foreach ($key in $newMap.Keys) {
    if (-not $baseMap.ContainsKey($key)) {
        $added.Add($key)
    } elseif ($newMap[$key] -ne $baseMap[$key]) {
        $modified.Add($key)
    }
}

# Files in baseline not in incoming => Deleted
foreach ($key in $baseMap.Keys) {
    if (-not $newMap.ContainsKey($key)) {
        $deleted.Add($key)
    }
}

$added    = $added    | Sort-Object
$deleted  = $deleted  | Sort-Object
$modified = $modified | Sort-Object

# --- Output ---

Write-Host "=== ADDED ($($added.Count)) - in new-usa, not in current ===" -ForegroundColor Green
if ($added.Count -eq 0) {
    Write-Host '  (none)' -ForegroundColor DarkGray
} else {
    $added | ForEach-Object { Write-Host "  + $_" -ForegroundColor Green }
}

Write-Host ""
Write-Host "=== DELETED ($($deleted.Count)) - in current, not in new-usa ===" -ForegroundColor Red
if ($deleted.Count -eq 0) {
    Write-Host '  (none)' -ForegroundColor DarkGray
} else {
    $deleted | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}

Write-Host ""
Write-Host "=== MODIFIED ($($modified.Count)) ===" -ForegroundColor Yellow
if ($modified.Count -eq 0) {
    Write-Host '  (none)' -ForegroundColor DarkGray
} else {
    $modified | ForEach-Object { Write-Host "  ~ $_" -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "Done. Added: $($added.Count)  Deleted: $($deleted.Count)  Modified: $($modified.Count)" -ForegroundColor Cyan
