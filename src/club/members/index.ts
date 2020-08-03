import { config } from "../../config";
import Mailchimp from "mailchimp-api-v3";

export const searchMembers = async (search: string): Promise<ClubMember[]> => {
    const mailchimp = new Mailchimp(config.communication.mailchimp.apiKey);

    const searched = await mailchimp.get({
        path: `/search-members?query=${search}`,
    });

    return searched.full_search.members.map((m: any) => (
        {
            firstName: m.merge_fields.FNAME,
            lastName: m.merge_fields.LNAME,
            email: m.email_address,
            tags: m.tags.map((t: any) => t.name)
        }
    ));
};

export const getAllMembers = async () => {
    const mailchimp = new Mailchimp(config.communication.mailchimp.apiKey);

    const list = await mailchimp.get({
        path: "/lists/44a0cdfc4f/members?count=1000",
    });

    console.log(list.members)

    return list.members
        .filter((m: any) => m.status === "subscribed")
        .map((m: any) => (
            {
                firstName: m.merge_fields.FNAME,
                lastName: m.merge_fields.LNAME,
                email: m.email_address,
                externalMapping: {
                    mailchimpId: m.id
                },
                tags: m.tags.map((t: any) => t.name)
            }
        ));
};


export interface ClubMember {
    firstName: string;
    lastName: string;
    email: string;
    tags: string[];
}