import assets0 from '../assets/stickers/sticker_among_us.json'
import assets1 from '../assets/stickers/sticker_anime_1.json'
import assets2 from '../assets/stickers/sticker_anime_2.json'
import assets3 from '../assets/stickers/sticker_anime_3.json'
import assets4 from '../assets/stickers/sticker_anime_4.json'
import assets5 from '../assets/stickers/sticker_anime_5.json'
import assets6 from '../assets/stickers/sticker_astromania.json'
import assets7 from '../assets/stickers/sticker_dancing_1.json'
import assets8 from '../assets/stickers/sticker_dancing_2.json'
import assets9 from '../assets/stickers/sticker_dancing_3.json'
import assets10 from '../assets/stickers/sticker_dancing_dog.json'
import assets11 from '../assets/stickers/sticker_emoji_1.json'
import assets12 from '../assets/stickers/sticker_emoji_2.json'
import assets13 from '../assets/stickers/sticker_emoji_3.json'
import assets14 from '../assets/stickers/sticker_emoji_4.json'
import assets15 from '../assets/stickers/sticker_emoji_5.json'
import assets16 from '../assets/stickers/sticker_emoji_6.json'
import assets17 from '../assets/stickers/sticker_ghost_1.json'
import assets18 from '../assets/stickers/sticker_ghost_2.json'
import assets19 from '../assets/stickers/sticker_ghost_3.json'
import assets20 from '../assets/stickers/sticker_kakashi.json'
import assets21 from '../assets/stickers/sticker_monkey_1.json'
import assets22 from '../assets/stickers/sticker_monkey_2.json'
import assets23 from '../assets/stickers/sticker_monkey_3.json'
import assets24 from '../assets/stickers/sticker_monkey_4.json'
import assets25 from '../assets/stickers/sticker_owl_1.json'
import assets26 from '../assets/stickers/sticker_owl_2.json'
import assets27 from '../assets/stickers/sticker_shark_1.json'
import assets28 from '../assets/stickers/sticker_shark_2.json'
import assets29 from '../assets/stickers/sticker_shark_3.json'
import assets30 from '../assets/stickers/sticker_shark_4.json'
import assets31 from '../assets/stickers/sticker_shark_5.json'
import assets32 from '../assets/stickers/sticker_shark_6.json'
import assets33 from '../assets/stickers/sticker_skull_1.json'
import assets34 from '../assets/stickers/sticker_skull_2.json'
import assets35 from '../assets/stickers/sticker_squirrel_1.json'
import assets36 from '../assets/stickers/sticker_squirrel_2.json'
import assets37 from '../assets/stickers/sticker_squirrel_3.json'
import assets38 from '../assets/stickers/sticker_yoda_1.json'
import assets39 from '../assets/stickers/sticker_yoda_2.json'
import assets40 from '../assets/stickers/sticker_yoda_3.json'
import assets41 from '../assets/stickers/sticker_yoda_4.json'


const stickerMap: Record<number, any> = {
    0: assets0,
    1: assets1,
    2: assets2,
    3: assets3,
    4: assets4,
    5: assets5,
    6: assets6,
    7: assets7,
    8: assets8,
    9: assets9,
    10: assets10,
    11: assets11,
    12: assets12,
    13: assets13,
    14: assets14,
    15: assets15,
    16: assets16,
    17: assets17,
    18: assets18,
    19: assets19,
    20: assets20,
    21: assets21,
    22: assets22,
    23: assets23,
    24: assets24,
    25: assets25,
    26: assets26,
    27: assets27,
    28: assets28,
    29: assets29,
    30: assets30,
    31: assets31,
    32: assets32,
    33: assets33,
    34: assets34,
    35: assets35,
    36: assets36,
    37: assets37,
    38: assets38,
    39: assets39,
    40: assets40,
    41: assets41,
};
 const stickerValue=(sticker: number)=>{
    return stickerMap[sticker] || null
}
export default stickerValue