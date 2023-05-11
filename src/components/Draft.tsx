import { useState, useContext, useEffect } from 'react'
import {
    TextField,
    Box,
    Stack,
    Button,
    useTheme,
    IconButton
} from '@mui/material'
import { Sign } from '../util'
import { ApplicationContext } from '../App'
import SendIcon from '@mui/icons-material/Send'
import { Schemas } from '../schemas'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { EmojiEmotions } from '@mui/icons-material'
// import { EmojiProps } from '@types/emoji-mart'

export interface EmojiProps {
    shortcodes: string
}

export interface DraftProps {
    currentStreams: string
}

export interface Skin {
    src: string
}

export interface Emoji {
    id: string
    name: string
    keywords: string[]
    skins: Skin[]
}

export interface CustomEmoji {
    id?: string
    name?: string
    emojis?: Emoji[]
    keywords?: string[] | undefined
}

export function Draft(props: DraftProps): JSX.Element {
    const appData = useContext(ApplicationContext)

    const [draft, setDraft] = useState<string>('')

    const [selectEmoji, setSelectEmoji] = useState<boolean>(false)

    const [typingEmoji, setTypingEmoji] = useState<boolean>(false)

    const [searchEmoji, setSearchEmoji] = useState<string>('')

    const [customEmoji, setCustomEmoji] = useState<CustomEmoji[]>([])

    const theme = useTheme()

    const isTypingEmoji = (text: string, pos: number | null): boolean => {
        let isTypingEmoji = false
        const emojiRegExp = /:[^  (\r\n|\n|\r)]*[^:(\r\n|\n|\r)]$/
        if (pos != null) {
            const processedString = text.slice(0, pos)
            const emojiWord = emojiRegExp.exec(processedString)
            if (emojiWord != null) {
                isTypingEmoji = true
                // console.log(emojiWord[0].slice(1))
                setSearchEmoji(emojiWord[0].slice(1))
            }
        }

        return isTypingEmoji
    }

    const post = (): void => {
        const payloadObj = {
            body: draft
        }

        const payload = JSON.stringify(payloadObj)
        const signature = Sign(appData.privatekey, payload)

        const requestOptions = {
            method: 'POST',
            headers: {},
            body: JSON.stringify({
                author: appData.userAddress,
                payload,
                signature,
                streams: [
                    ...new Set([
                        ...props.currentStreams.split(','),
                        appData.profile.homestream
                    ])
                ]
                    .filter((e) => e)
                    .join(','),
                schema: Schemas.simpleNote
            })
        }

        fetch(appData.serverAddress + 'messages', requestOptions)
            .then(async (res) => await res.json())
            .then((data) => {
                console.log(data)
                setDraft('')
            })
    }

    useEffect(() => {
        const emojis: CustomEmoji[] = [
            {
                id: 'fluffy',
                name: 'Fluffy Social',
                emojis: Object.entries(appData.emojiDict).map(
                    ([key, value]) => ({
                        id: key,
                        name: value.name,
                        keywords: value.aliases,
                        skins: [{ src: value.publicUrl }]
                    })
                )
            }
        ]

        setCustomEmoji(emojis)
    }, [appData.emojiDict])

    return (
        <Stack sx={{ position: 'relative' }}>
            <TextField
                multiline
                rows={6}
                label="message"
                variant="outlined"
                value={draft}
                onChange={(e) => {
                    setDraft(e.target.value)
                    setTypingEmoji(
                        isTypingEmoji(e.target.value, e.target.selectionStart)
                    )
                }}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: theme.palette.text.disabled
                    },
                    '& .MuiOutlinedInput-root': {
                        '& > fieldset': {
                            borderColor: theme.palette.text.disabled
                        }
                    }
                }}
                onKeyDown={(e: any) => {
                    if (draft.length === 0 || draft.trim().length === 0) return
                    if (e.key === 'Enter' && e.ctrlKey === true) {
                        post()
                    }
                }}
            />
            {!selectEmoji || (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 170,
                        right: { xs: 10, mb: 90 },
                        zIndex: 9
                    }}
                >
                    <Picker
                        data={data}
                        categories={['fluffy']}
                        custom={customEmoji}
                        searchPosition="static"
                        onEmojiSelect={(emoji: EmojiProps) => {
                            console.log(typeof emoji)
                            setDraft(draft + emoji.shortcodes)
                        }}
                    />
                </Box>
            )}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10
                }}
            >
                <IconButton
                    sx={{ color: theme.palette.text.secondary }}
                    onClick={() => {
                        setSelectEmoji(!selectEmoji)
                    }}
                >
                    <EmojiEmotions />
                </IconButton>
                <Button
                    color="primary"
                    variant="contained"
                    disabled={draft.length === 0 || draft.trim().length === 0}
                    onClick={(_) => {
                        post()
                    }}
                    sx={{
                        '&.Mui-disabled': {
                            background: theme.palette.divider,
                            color: theme.palette.text.disabled
                        }
                    }}
                    endIcon={<SendIcon />}
                >
                    Send
                </Button>
            </Box>
        </Stack>
    )
}
