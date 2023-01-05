import { Allow, Entity, Fields, remult, Validators } from "remult";

@Entity<Note>("notes", {
  allowApiCrud: Allow.authenticated,
  // Always filter by current user
  backendPrefilter: () => ({
    userId: remult.user?.id || "no",
  }),
})
export class Note {
  @Fields.uuid()
  id!: string;
  @Fields.string({
    validate: Validators.required,
  })
  title = "";
  @Fields.string({
    validate: Validators.required,
  })
  body = "";
  @Fields.date({ includeInApi: false })
  createdAt = new Date();
  @Fields.date<Note>({
    includeInApi: false,
    saving: (note) => (note.updatedAt = new Date()),
  })
  updatedAt = new Date();
  @Fields.string({ includeInApi: false })
  userId = remult.user?.id;
}
