import fontforge
import unicodedata

font = fontforge.open("Pixellari.ttf")
vi = "aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệghiìíỉĩịklmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvxyỳýỷỹỵAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬBCDĐEÈÉẺẼẸÊỀẾỂỄỆGHIÌÍỈĨỊKLMNOÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢPQRSTUÙÚỦŨỤƯỪỨỬỮỰVXYỲÝỶỸỴ"

seen = []
for ch in vi:
    if ch not in seen:
        seen.append(ch)

missing = []
for ch in seen:
    cp = ord(ch)
    try:
        _ = font[cp].glyphname
    except Exception:
        missing.append(ch)

print("required", len(seen))
print("missing", len(missing))
for ch in missing:
    cp = ord(ch)
    print("U+%04X\t%s\t%s" % (cp, ch, unicodedata.name(ch, "UNKNOWN")))
