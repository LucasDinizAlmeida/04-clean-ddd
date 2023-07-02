import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './commen'

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId() {
    return this.props.answerId
  }

  static create(
    props: Optional<AnswerCommentProps, 'createAt'>,
    id?: UniqueEntityId,
  ) {
    const answer = new AnswerComment(
      {
        ...props,
        createAt: new Date(),
      },
      id,
    )

    return answer
  }
}
