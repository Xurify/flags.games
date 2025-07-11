import { wordLists } from './wordLists';

export interface WordLists {
    adjectives: string[];
    nouns: string[];
    verbs: string[];
    colors: string[];
    animals: string[];
    tech: string[];
    nature: string[];
    food: string[];
}

export class UsernameGenerator {
    private wordLists: WordLists;

    constructor(customWordLists?: Partial<WordLists>) {
        this.wordLists = { ...wordLists, ...customWordLists };
    }

    generateUsername(includeNumber: boolean = false): string {
        const useAdjective = Math.random() < 0.5;

        const firstWord = useAdjective
            ? this.getRandomElement(this.wordLists.adjectives)
            : this.getRandomElement(this.wordLists.verbs);

        const secondWord = this.getRandomElement(this.wordLists.nouns);

        let username = this.capitalizeFirst(firstWord) + this.capitalizeFirst(secondWord);

        if (includeNumber) {
            username += this.generateFourDigitNumber();
        }

        return username;
    }

    private getRandomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    private capitalizeFirst(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    private generateFourDigitNumber(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
}