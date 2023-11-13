import { Box, Chip } from '@mui/material'

import {
    type RerouteMessageSchema,
    type Message,
    type ReplyMessageSchema,
    type SimpleNoteSchema
} from '@concurrent-world/client'
import { useApi } from '../../context/api'
import { MessageView } from './MessageView'
import { OneLineMessageView } from './OneLineMessageView'
import { useEffect, useState } from 'react'

export interface ReplyMessageFrameProp {
    message: Message<ReplyMessageSchema>
    lastUpdated?: number
    userCCID: string
    rerouted?: Message<RerouteMessageSchema>
}

export const ReplyMessageFrame = (props: ReplyMessageFrameProp): JSX.Element => {
    const client = useApi()

    const [replyTo, setReplyTo] = useState<Message<SimpleNoteSchema | ReplyMessageSchema> | null>()

    useEffect(() => {
        if (props.message) {
            props.message.getReplyTo().then((msg) => {
                setReplyTo(msg)
            })
        }
    }, [props.message])

    return (
        <>
            {replyTo && <OneLineMessageView message={replyTo} />}
            <Box>
                <MessageView
                    userCCID={client.ccid}
                    message={props.message}
                    beforeMessage={
                        <Chip
                            label={`@${replyTo?.authorUser?.profile?.payload.body.username || 'anonymous'}`}
                            size="small"
                            sx={{ width: 'fit-content', mb: 1 }}
                        />
                    }
                    rerouted={props.rerouted}
                />
            </Box>
        </>
    )
}
