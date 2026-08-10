// modules/pkg_communication/pkg-communication.module.ts
import { Module } from '@nestjs/common';

import { CommunicationController } from './communication/communication.controller';
import { CommunicationService } from './communication/communication.service';

import { DiscussionController } from './discussion/discussion.controller';
import { DiscussionService } from './discussion/discussion.service';

import { DiscussionMembreController } from './discussion-membre/discussion-membre.controller';
import { DiscussionMembreService } from './discussion-membre/discussion-membre.service';

import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';

import { FournitureController } from './fourniture/fourniture.controller';
import { FournitureService } from './fourniture/fourniture.service';

@Module({
  controllers: [
    CommunicationController,
    DiscussionController,
    DiscussionMembreController,
    MessageController,
    FournitureController,
  ],
  providers: [
    CommunicationService,
    DiscussionService,
    DiscussionMembreService,
    MessageService,
    FournitureService,
  ],
  exports: [
    CommunicationService,
    DiscussionService,
    DiscussionMembreService,
    MessageService,
    FournitureService,
  ],
})
export class PkgCommunicationModule {}
